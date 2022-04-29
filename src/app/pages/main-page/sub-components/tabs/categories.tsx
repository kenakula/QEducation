/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, IconButton, Typography } from '@mui/material';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import React, { useState } from 'react';
import AdminToolbar from '../admin-toolbar';
import {
  CategoriesContainer,
  CategoriesSection,
  CategoryItem,
  ImageContainer,
} from '../styled-elements';
import UserCategoriesDialog from '../user-categories-dialog';
import { ReactComponent as ArticleImage } from 'assets/images/article-image.svg';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDialog from 'app/components/confirm-dialog/confirm-dialog';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';
import { OpenState } from 'app/constants/open-state';
import { DeleteConfirmProps } from 'app/pages/admin-articles-page/admin-articles-page';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { generatePath, useHistory } from 'react-router-dom';
import { Routes } from 'app/routes/routes';
import { BootState } from 'app/constants/boot-state';
import Loader from 'app/components/loader/loader';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';

const Articles = observer((): JSX.Element => {
  const store = useMainPageStore();
  const adminStore = useAdminStore();
  const history = useHistory();

  const [categoriesDialogOpenState, setCategoriesDialogOpenState] = useState(
    OpenState.Closed,
  );
  const [sortedList, setSortedList] = useState<CategoryArticle[] | undefined>(
    undefined,
  );
  const [deleteAction, setDeleteAction] = useState<DeleteConfirmProps>({
    id: '',
    openState: OpenState.Closed,
  });
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    openState: OpenState.Closed,
    message: 'Категория сохранена',
    alert: 'success',
  });

  const handleCategoriesDialogOpen = (): void => {
    setCategoriesDialogOpenState(OpenState.Opened);
  };

  const handleCategoriesDialogClose = (): void => {
    setCategoriesDialogOpenState(OpenState.Closed);
  };

  const handleCategoryDelete = (e: React.MouseEvent, id: string): void => {
    e.persist();
    e.stopPropagation();
    setDeleteAction(prev => ({
      ...prev,
      id,
      openState: OpenState.Opened,
    }));
  };

  const handleCategoryEdit = (e: React.MouseEvent, id: string): void => {
    e.persist();
    e.stopPropagation();
    setSortedList(store.userCategoryArticles);
    adminStore.setEditingUserCategory(id);
    handleCategoriesDialogOpen();
  };

  const handleCategoryChoose = (id: string): void => {
    history.push({
      pathname: generatePath(Routes.ARTICLES_VIEW, { categoryId: id }),
      search: `?role=${
        store.profileInfo.isSuperAdmin
          ? store.selectedRole
          : store.profileInfo.role
      }`,
    });
  };

  switch (store.bootState) {
    case BootState.Success:
      return (
        <>
          <CategoriesSection container spacing={4}>
            <Grid item xs={12} md={6}>
              <ImageContainer>
                <ArticleImage width="100%" height={300} />
              </ImageContainer>
            </Grid>
            <Grid xs={12} md={6} item>
              {store.isSuperAdmin ? (
                <AdminToolbar
                  dialogOpener={handleCategoriesDialogOpen}
                  tooltipText="Добавить категорию и статьи для выбранной роли пользователей"
                />
              ) : null}
              {store.roleCategories.length ? (
                <CategoriesContainer>
                  {store.roleCategories.map((item: Category) => (
                    <CategoryItem
                      key={item.id}
                      onClick={() => handleCategoryChoose(item.id)}
                    >
                      {item.title}
                      <Typography variant="caption">
                        {item.description}
                      </Typography>
                      {store.isSuperAdmin ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={e => handleCategoryDelete(e, item.id)}
                          >
                            <ClearIcon fontSize="small" color="error" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={e => handleCategoryEdit(e, item.id)}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </>
                      ) : null}
                      <span />
                    </CategoryItem>
                  ))}
                </CategoriesContainer>
              ) : (
                <Typography textAlign="center" variant="h5">
                  Нет категорий и статей для просмотра
                  {store.isSuperAdmin ? (
                    <Typography
                      sx={{ display: 'block' }}
                      textAlign="center"
                      variant="caption"
                      color="text.secondary"
                    >
                      Нажмите на плюсик чтобы добавить категорию и статьи для
                      нее
                    </Typography>
                  ) : null}
                </Typography>
              )}
            </Grid>
          </CategoriesSection>
          <UserCategoriesDialog
            list={sortedList ?? undefined}
            openState={categoriesDialogOpenState}
            store={store}
            onClose={handleCategoriesDialogClose}
          />
          <ConfirmDialog
            open={deleteAction.openState}
            title="Уверены что хотите удалить категорию?"
            message="Это действие необратимо"
            handleClose={() =>
              setDeleteAction(prev => ({
                ...prev,
                openState: OpenState.Closed,
              }))
            }
            handleAgree={() => {
              adminStore
                .deleteUserCategory(deleteAction.id, store.selectedRole)
                .then(() => store.fetchRoles())
                .then(() => store.getUserCategories(store.selectedRole))
                .then(() =>
                  setSnackbarState(prev => ({
                    ...prev,
                    openState: OpenState.Opened,
                    message: 'Категория удалена',
                    alert: 'error',
                  })),
                );
            }}
          />
          <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
        </>
      );
    case BootState.Error:
      return <TechnicalIssues />;
    default:
      return <Loader />;
  }
});

export default Articles;
