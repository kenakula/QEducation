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
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';
import { generatePath, useHistory } from 'react-router-dom';
import { Routes } from 'app/routes/routes';
import { BootState } from 'app/constants/boot-state';
import { Loader } from 'app/components/loader';
import { TechnicalIssues } from 'app/components/technical-issues';
import {
  ModalDialogConfirm,
  ModalDialogConfirmStateProps,
} from 'app/components/modal-dialog';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';

export const Categories = observer((): JSX.Element => {
  const store = useMainPageStore();
  const adminStore = useAdminStore();
  const history = useHistory();

  const [categoriesDialogOpenState, setCategoriesDialogOpenState] =
    useState(false);
  const [sortedList, setSortedList] = useState<CategoryArticle[] | undefined>(
    undefined,
  );
  const [deleteAction, setDeleteAction] =
    useState<ModalDialogConfirmStateProps>({
      id: '',
      isOpen: false,
    });
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Категория сохранена',
    alert: 'success',
  });

  const handleCategoriesDialogOpen = (): void => {
    setCategoriesDialogOpenState(true);
  };

  const handleCategoriesDialogClose = (): void => {
    setCategoriesDialogOpenState(false);
  };

  const handleCategoryDelete = (e: React.MouseEvent, id: string): void => {
    e.persist();
    e.stopPropagation();
    setDeleteAction(prev => ({
      ...prev,
      id,
      isOpen: true,
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
      pathname: generatePath(Routes.CATEGORY_ARTICLES, { categoryId: id }),
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
            open={categoriesDialogOpenState}
            store={store}
            onClose={handleCategoriesDialogClose}
          />
          <ModalDialogConfirm
            isOpen={deleteAction.isOpen}
            title="Уверены что хотите удалить категорию?"
            handleClose={() =>
              setDeleteAction(prev => ({
                ...prev,
                isOpen: false,
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
                    isOpen: true,
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
      return <TechnicalIssues message="При загрузке произошла ошибка" />;
    default:
      return <Loader />;
  }
});
