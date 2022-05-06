import { Button, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import ConfirmDialog from 'app/components/confirm-dialog/confirm-dialog';
import DataGridComponent from 'app/components/data-grid/data-grid-component';
import { IToolbarFields } from 'app/components/data-grid/sub-components/custom-toolbar';
import { ArticleModel } from 'app/constants/article-model';
import { BootState } from 'app/constants/boot-state';
import { OpenState } from 'app/constants/open-state';
import { userRolesOptions } from 'app/constants/user-roles';
import { Routes } from 'app/routes/routes';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { getColumns } from './sub-components/columns';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import AddIcon from '@mui/icons-material/Add';
import CategoriesDialog from '../admin-articles-editor/sub-components/categories-dialog';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { Category } from 'app/constants/category-model';
import Main from 'app/components/main/main';
import PageTitle from 'app/components/page-title/page-title';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';

export interface DeleteConfirmProps {
  id: string;
  openState: OpenState;
}

const AdminArticlesPage = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const store = useMainPageStore();
  const history = useHistory();

  const [categoriesOpenState, setCategoriesOpenState] = useState<OpenState>(
    OpenState.Closed,
  );
  const [deleteAction, setDeleteAction] = useState<DeleteConfirmProps>({
    id: '',
    openState: OpenState.Closed,
  });
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    openState: OpenState.Closed,
    message: 'Статья сохранена',
    alert: 'success',
  });

  const editArticle = (data: ArticleModel): void => {
    adminStore.editArticle(data);
    history.push(Routes.ADMIN_ARTICLES_EDITOR);
  };

  const moveToArticle = (id: string): void =>
    history.push(
      generatePath(Routes.ARTICLE_PAGE, {
        articleId: id,
      }),
    );

  const onLinkCopy = (): void => {
    setSnackbarState(prev => ({
      ...prev,
      openState: OpenState.Opened,
      message: 'Ссылка скопирована',
      alert: 'success',
    }));
  };

  const theme = useTheme();
  const matchesTablet = useMediaQuery(theme.breakpoints.up('md'));

  const columns = getColumns({
    edit: editArticle,
    view: moveToArticle,
    setDelete: setDeleteAction,
    copyLinkCb: onLinkCopy,
    matchTablet: matchesTablet,
  });

  const filterFields: IToolbarFields[] = [
    { type: 'search', fieldName: 'title', label: 'Поиск' },
    {
      type: 'select',
      fieldName: 'roles',
      label: 'Специальности',
      options: userRolesOptions,
    },
    {
      type: 'select',
      fieldName: 'categories',
      label: 'Категории',
      options: adminStore.categories.map((item: Category) => ({
        label: item.title,
        value: item.title,
      })),
    },
    {
      type: 'custom',
      fieldName: 'custom-create',
      label: 'custom-create',
      component: (
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            adminStore.emptyArticle();
            adminStore.deleteArticleFromStorage();
            history.push(Routes.ADMIN_ARTICLES_EDITOR);
          }}
          endIcon={<AddIcon />}
        >
          Создать
        </Button>
      ),
    },
    {
      type: 'custom',
      fieldName: 'custom-category',
      label: 'custom-category',
      component: (
        <Button
          color="primary"
          fullWidth
          variant="outlined"
          onClick={() => setCategoriesOpenState(OpenState.Opened)}
          endIcon={<AddIcon />}
        >
          Категории
        </Button>
      ),
    },
  ];

  const gridInitialState: GridInitialStateCommunity = {
    sorting: {
      sortModel: [{ field: 'created', sort: 'desc' }],
    },
  };

  const filterParams: any = {
    title: '',
    roles: [],
    categories: [],
  };

  useEffect(() => {
    if (!adminStore.isInited) {
      adminStore.init();
    }
  }, [adminStore]);

  return (
    <Main>
      <PageTitle>Все статьи</PageTitle>
      {adminStore.bootState === BootState.Success ? (
        <DataGridComponent<ArticleModel>
          columns={columns}
          rows={toJS(adminStore.articles)}
          onClick={id => moveToArticle(id)}
          toolbarFields={filterFields}
          filterParams={filterParams}
          initialState={gridInitialState}
          loading={adminStore.articlesLoading}
        />
      ) : (
        <Skeleton width="100%" height="100%" />
      )}
      <ConfirmDialog
        open={deleteAction.openState}
        title="Уверены что хотите удалить статью?"
        message="Это действие необратимо"
        handleClose={() =>
          setDeleteAction(prev => ({ ...prev, openState: OpenState.Closed }))
        }
        handleAgree={() => {
          adminStore
            .deleteArticle(deleteAction.id)
            .then(() =>
              setSnackbarState(prev => ({
                ...prev,
                openState: OpenState.Opened,
                message: 'Статья удалена',
                alert: 'error',
              })),
            )
            .then(() => store.deleteArticleFromUserCategory(deleteAction.id));
        }}
      />
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
      <CategoriesDialog
        store={adminStore}
        openState={categoriesOpenState}
        handleClose={() => setCategoriesOpenState(OpenState.Closed)}
      />
    </Main>
  );
});

export default AdminArticlesPage;
