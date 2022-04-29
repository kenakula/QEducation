import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { TextEditor } from 'app/components/text-editor/text-editor';
import { ArticleModel } from 'app/constants/article-model';
import { OpenState } from 'app/constants/open-state';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { editorFormSchema } from './sub-components/editor-form';
import { nanoid } from 'nanoid';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';
import { Timestamp } from 'firebase/firestore';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import CategoriesDialog from './sub-components/categories-dialog';
import {
  CustomInputLabel,
  InputContainer,
  MainInfoBox,
} from './sub-components/elements';
import InputComponent from 'app/components/input-component/input-component';
import SelectComponent from 'app/components/select-component/select-component';
import AddIcon from '@mui/icons-material/Add';
import { InputType } from 'app/constants/input-type';
import { userRolesOptions } from 'app/constants/user-roles';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import SaveArticleDialog from './sub-components/save-article-dialog';
import { Category } from 'app/constants/category-model';
import Main from 'app/components/main/main';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';

const AdminArticlesEditor = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const store = useMainPageStore();

  const [categoriesOpenState, setCategoriesOpenState] = useState<OpenState>(
    OpenState.Closed,
  );
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [saveArticleDialog, setSaveArticleDialog] = useState<OpenState>(
    OpenState.Closed,
  );
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    openState: OpenState.Closed,
    message: 'Статья сохранена',
    alert: 'success',
  });

  useEffect(() => {
    adminStore.init();
  }, [adminStore]);

  useEffect(() => {
    const storedArticle = adminStore.getArticleFromStorage();

    if (storedArticle) {
      setArticle(storedArticle);
    }
  }, [adminStore]);

  const handleSaveArticleDialogClose = (): void => {
    setSaveArticleDialog(OpenState.Closed);
  };

  const getArticle = (): ArticleModel => {
    if (adminStore.editingArticle) {
      return adminStore.editingArticle;
    }

    return {
      id: nanoid(),
      title: '',
      description: '',
      delta: '',
      roles: [],
      categories: [],
      readMore: [],
    };
  };

  const { control, formState, handleSubmit, setValue, reset } =
    useForm<ArticleModel>({
      defaultValues: getArticle(),
      resolver: yupResolver(editorFormSchema),
    });

  const resetForm = (): void => {
    reset();
    adminStore.deleteArticleFromStorage();
    adminStore.emptyArticle();
    adminStore.goBackToMainUrl = '';
    setValue('id', nanoid());
    setValue('delta', '');
    setValue('title', '');
    setValue('description', '');
    setValue('roles', []);
    setValue('categories', []);
    setValue('readMore', []);
    setSnackbarState(prev => ({
      ...prev,
      openState: OpenState.Opened,
      message: 'Форма сброшена',
      alert: 'warning',
    }));
  };

  useEffect(() => {
    if (article) {
      setValue('id', article.id);
      setValue('delta', article.delta);
      setValue('title', article.title);
      setValue('description', article.description);
      setValue('roles', article.roles);
      setValue('categories', article.categories);
      setValue('readMore', article.readMore);
    }
  }, [article, setValue]);

  const saveToDrafts = (): void => {
    const data = control._formValues as ArticleModel;
    adminStore.saveArticleToStorage(data);
  };

  useEffect(() => {
    adminStore.startArticleAutosave(saveToDrafts, 60000);

    return () => adminStore.stopArticleAutoSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: ArticleModel): void => {
    setArticleLoading(true);

    const obj: ArticleModel = {
      ...data,
      created: Timestamp.now().toDate(),
    };

    adminStore
      .saveArticle(obj)
      .then(() => {
        setArticleLoading(false);
        adminStore.deleteArticleFromStorage();

        if (adminStore.goBackToMainUrl && adminStore.goBackToMainUrl.length) {
          adminStore
            .addArticleToUserCategory(
              { id: obj.id, description: obj.description, title: obj.title },
              store.selectedRole,
              store.selectedCategory,
            )
            .then(() => {
              store.getUserCategories(store.selectedRole);
              store.getArticlesFromUserCategory(store.selectedCategory.id);
            });
        }

        setSaveArticleDialog(OpenState.Opened);
      })
      .catch(error => {
        setArticleLoading(false);
        setSnackbarState(prev => ({
          ...prev,
          openState: OpenState.Opened,
          message: `ОШИБКА: ${error}`,
          alert: 'error',
        }));
      });
  };

  return (
    <Main>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '100%', flexGrow: 1, display: 'flex' }}
        className="article-editor"
      >
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={9} sx={{ pb: 2 }}>
            <>
              <MainInfoBox>
                <InputContainer>
                  <CustomInputLabel>Название статьи:</CustomInputLabel>
                  <InputComponent
                    small
                    formControl={control}
                    name="title"
                    placeholder="Введите значение"
                    type={InputType.Text}
                    error={!!formState.errors.title}
                    errorMessage={
                      !!formState.errors.title
                        ? formState.errors.title.message
                        : undefined
                    }
                  />
                </InputContainer>
                <InputContainer>
                  <CustomInputLabel>Краткое описание:</CustomInputLabel>
                  <InputComponent
                    small
                    formControl={control}
                    name="description"
                    placeholder="Введите значение"
                    type={InputType.Text}
                    error={!!formState.errors.description}
                    errorMessage={
                      !!formState.errors.description
                        ? formState.errors.description.message
                        : undefined
                    }
                  />
                </InputContainer>
                <InputContainer>
                  <CustomInputLabel>Специальности:</CustomInputLabel>
                  <SelectComponent
                    small
                    id="role-select"
                    name="roles"
                    options={userRolesOptions}
                    formControl={control}
                    multipleChoice
                    error={!!formState.errors.roles}
                    errorMessage={
                      !!formState.errors.roles && 'Выберите специальности'
                    }
                    placeholder="Выберите специальности"
                  />
                </InputContainer>
                <InputContainer>
                  <CustomInputLabel>Категории статьи</CustomInputLabel>
                  <SelectComponent
                    small
                    options={adminStore.categories.map((item: Category) => ({
                      label: item.title,
                      value: item.title,
                    }))}
                    id="categories"
                    formControl={control}
                    name="categories"
                    multipleChoice
                    placeholder="Категории"
                    error={!!formState.errors.categories}
                    errorMessage={
                      !!formState.errors.categories && 'Выберите специальности'
                    }
                  />
                  <IconButton
                    color="primary"
                    sx={{ width: '50px', height: '50px', marginLeft: '10px' }}
                    onClick={() => setCategoriesOpenState(OpenState.Opened)}
                  >
                    <AddIcon fontSize="large" />
                  </IconButton>
                </InputContainer>
                <InputContainer>
                  <CustomInputLabel>Прикрепить статьи</CustomInputLabel>
                  <SelectComponent
                    small
                    autocomplete
                    multipleChoice
                    fullWidth
                    formControl={control}
                    name="readMore"
                    id="readMore"
                    options={adminStore.articles
                      .map(item => ({
                        title: item.title,
                        id: item.id,
                      }))
                      .sort((a, b) => -b.title[0].localeCompare(a.title[0]))}
                    group={option => option.title[0]}
                  />
                </InputContainer>
              </MainInfoBox>
              <Typography color="error">
                {!!formState.errors.delta && formState.errors.delta.message}
              </Typography>
              <TextEditor control={control} />
              <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
            </>
          </Grid>
          <Grid item xs={12} md={3} pl={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <LoadingButton
                loadingPosition="start"
                loading={articleLoading}
                startIcon={<SaveIcon />}
                type="submit"
                variant="contained"
                sx={{ mb: 2 }}
              >
                Сохранить
              </LoadingButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => resetForm()}
              >
                Очистить
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <CategoriesDialog
        store={adminStore}
        openState={categoriesOpenState}
        handleClose={() => setCategoriesOpenState(OpenState.Closed)}
      />
      <SaveArticleDialog
        open={saveArticleDialog}
        handleClose={handleSaveArticleDialogClose}
        resetFunc={resetForm}
        goBack={adminStore.goBackToMainUrl}
      />
    </Main>
  );
});

export default AdminArticlesEditor;
