/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, IconButton, Typography } from '@mui/material';
import Loader from 'app/components/loader/loader';
import Main from 'app/components/main/main';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';
import { BootState } from 'app/constants/boot-state';
import { UserRole } from 'app/constants/user-roles';
import {
  PageContentType,
  useMainPageStore,
} from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { ReactComponent as ArticleImage } from 'assets/images/article-image.svg';
import {
  CategoriesContainer,
  CategoriesSection,
  CategoryItem,
  ImageContainer,
  TabItemPanel,
} from './sub-components/styled-elements';
import { Category, CategoryArticle } from 'app/constants/category-model';
import TabsComponent, {
  TabsItem,
} from 'app/components/tabs-component/tabs-component';
import { Routes } from 'app/routes/routes';
import { TabContext } from '@mui/lab';
import Construction from 'app/components/construction/construction';
import AdminToolbar from './sub-components/admin-toolbar';
import UserCategoriesDialog from './sub-components/user-categories-dialog';
import { OpenState } from 'app/constants/open-state';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import ConfirmDialog from 'app/components/confirm-dialog/confirm-dialog';
import { DeleteConfirmProps } from '../admin-articles-page/admin-articles-page';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';

const roleTabs: TabsItem<UserRole>[] = [
  {
    value: UserRole.Doctor,
    label: 'Врачи',
  },
  {
    value: UserRole.Administrator,
    label: 'Администраторы',
  },
  {
    value: UserRole.Nurse,
    label: 'Медсёстры',
  },
];

const contentTabs: TabsItem<PageContentType>[] = [
  {
    value: PageContentType.Articles,
    label: 'Статьи',
  },
  {
    value: PageContentType.Checklists,
    label: 'Чеклисты',
  },
  {
    value: PageContentType.Vebinars,
    label: 'Вебинары',
  },
  {
    value: PageContentType.Scripts,
    label: 'Скрипты',
  },
];

const MainPage = observer((): JSX.Element => {
  const store = useMainPageStore();
  const adminStore = useAdminStore();

  const history = useHistory();

  const [categoriesDialogOpenState, setCategoriesDialogOpenState] = useState(
    OpenState.Closed,
  );
  const [currentRoleTab, setCurrentRoleTab] = useState<UserRole>(
    ((store.pageParams && store.pageParams.role) as UserRole) ??
      UserRole.Doctor,
  );
  const [currentContentTab, setCurrentContentTab] = useState<PageContentType>(
    ((store.pageParams && store.pageParams.content) as PageContentType) ??
      PageContentType.Articles,
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

  useEffect(() => {
    store.setPageParams({ role: currentRoleTab });
  }, []);

  useEffect(() => {
    store.init();
  }, [store]);

  useEffect(() => {
    if (store.profileInfo && !store.isSuperAdmin) {
      setCurrentRoleTab(store.profileInfo.role);
    }
  }, [store.profileInfo]);

  useEffect(() => {
    if (store.roles && store.profileInfo) {
      const role = store.isSuperAdmin ? currentRoleTab : store.profileInfo.role;
      store.getUserCategories(role);
    }
  }, [store.roles, store.profileInfo]);

  const handleRoleTabChange = (
    event: React.SyntheticEvent,
    newValue: UserRole,
  ): void => {
    store.setPageParams({ role: newValue });
    store.getUserCategories(newValue);
    setCurrentRoleTab(newValue);
  };

  const handleContentTabChange = (
    event: React.SyntheticEvent,
    newValue: PageContentType,
  ): void => {
    store.setPageParams({ content: newValue });
    setCurrentContentTab(newValue);
  };

  const handleCategoryChoose = (id: string): void => {
    history.push({
      pathname: generatePath(Routes.ARTICLES_VIEW, { categoryId: id }),
      search: `?role=${
        store.profileInfo.isSuperAdmin
          ? store.pageParams.role
          : store.profileInfo.role
      }`,
    });
  };

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
    setSortedList(store.getArticlesFromUserCategories(id));
    adminStore.setEditingUserCategory(id);
    handleCategoriesDialogOpen();
  };

  const renderContent = (): JSX.Element => {
    switch (store.bootState) {
      case BootState.Success:
        return (
          <>
            {store.profileInfo.isSuperAdmin ? (
              <TabsComponent<UserRole>
                currentTab={currentRoleTab}
                handleChange={handleRoleTabChange}
                tabs={roleTabs}
              />
            ) : null}
            <TabsComponent<PageContentType>
              currentTab={currentContentTab}
              handleChange={handleContentTabChange}
              tabs={contentTabs}
            />
            <TabContext value={currentContentTab}>
              <TabItemPanel value={PageContentType.Articles}>
                <CategoriesSection container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
                      Выберите категорию
                    </Typography>
                    <ImageContainer>
                      <ArticleImage width="100%" height={300} />
                    </ImageContainer>
                  </Grid>
                  <Grid xs={12} md={6} item>
                    {store.isSuperAdmin ? (
                      <AdminToolbar
                        onOpenCategoriesDialog={handleCategoriesDialogOpen}
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
                                  onClick={e =>
                                    handleCategoryDelete(e, item.id)
                                  }
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
                            Нажмите на плюсик чтобы вставить категорию
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
                  role={currentRoleTab}
                  onClose={handleCategoriesDialogClose}
                />
              </TabItemPanel>
              <TabItemPanel value={PageContentType.Checklists}>
                <Construction text="Тут будут чеклисты" />
              </TabItemPanel>
              <TabItemPanel value={PageContentType.Scripts}>
                <Construction text="Тут будут скрипты" />
              </TabItemPanel>
              <TabItemPanel value={PageContentType.Vebinars}>
                <Construction text="Тут будут вебинары" />
              </TabItemPanel>
            </TabContext>
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
                  .deleteUserCategory(deleteAction.id, currentRoleTab)
                  .then(() => store.fetchRoles())
                  .then(() => store.getUserCategories(currentRoleTab))
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
  };

  return <Main>{renderContent()}</Main>;
});

export default MainPage;
