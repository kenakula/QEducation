import { Button, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { IToolbarFields } from 'app/components/data-grid/sub-components/custom-toolbar';
import { ArticleModel } from 'app/constants/article-model';
import { BootState } from 'app/constants/boot-state';
import { userRolesOptions } from 'app/constants/user-roles';
import { Routes } from 'app/routes/routes';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { getColumns } from './sub-components/columns';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import AddIcon from '@mui/icons-material/Add';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { Category } from 'app/constants/category-model';
import { Main } from 'app/components/main';
import { PageTitle } from 'app/components/typography';
import {
  ModalDialogConfirm,
  ModalDialogConfirmStateProps,
} from 'app/components/modal-dialog';
import { DataGridComponent } from 'app/components/data-grid';
import { CategoriesDialog } from './sub-components/categories-dialog';

const AdminArticlesPage = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const history = useHistory();

  useEffect(() => {
    if (!adminStore.isInited) {
      adminStore.init();
    }
  }, [adminStore]);

  const [categoriesOpenState, setCategoriesOpenState] = useState(false);
  const [deleteAction, setDeleteAction] =
    useState<ModalDialogConfirmStateProps>({
      id: '',
      isOpen: false,
    });
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Статья сохранена',
    alert: 'success',
  });

  const handleCategoriesDaialogClose = (): void => {
    setCategoriesOpenState(false);
  };

  const editArticle = (data: ArticleModel): void => {
    adminStore.editArticle(data);
    history.push(Routes.ADMIN_ARTICLES_EDITOR);
  };

  const moveToArticle = (id: string): void =>
    history.push(
      generatePath(Routes.SINGLE_ARTICLE, {
        articleId: id,
      }),
    );

  const onLinkCopy = (): void => {
    setSnackbarState(prev => ({
      ...prev,
      isOpen: true,
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
          onClick={() => setCategoriesOpenState(true)}
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
      <ModalDialogConfirm
        isOpen={deleteAction.isOpen}
        title="Уверены что хотите удалить статью?"
        handleClose={() =>
          setDeleteAction(prev => ({ ...prev, isOpen: false }))
        }
        handleAgree={() => {
          adminStore.deleteArticle(deleteAction.id).then(() =>
            setSnackbarState(prev => ({
              ...prev,
              isOpen: true,
              message: 'Статья удалена',
              alert: 'error',
            })),
          );
        }}
      />
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
      <CategoriesDialog
        store={adminStore}
        isOpen={categoriesOpenState}
        handleClose={handleCategoriesDaialogClose}
      />
    </Main>
  );
});

export default AdminArticlesPage;
