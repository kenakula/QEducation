import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { ArticleModel } from 'app/constants/article-model';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { editorFormSchema } from './sub-components/editor-form';
import { nanoid } from 'nanoid';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { Timestamp } from 'firebase/firestore';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import {
  CustomInputLabel,
  InputContainer,
  MainInfoBox,
} from './sub-components/elements';
import { InputComponent, SelectComponent } from 'app/components/form-controls';
import AddIcon from '@mui/icons-material/Add';
import { InputType } from 'app/constants/input-type';
import { userRolesOptions } from 'app/constants/user-roles';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import SaveArticleDialog from './sub-components/save-article-dialog';
import { Category } from 'app/constants/category-model';
import { Main } from 'app/components/main';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { TextEditor } from 'app/components/text-editor';
import { PageTitle } from 'app/components/typography';
import { CategoriesDialog } from './sub-components/categories-dialog';

const AdminArticlesEditor = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const store = useMainPageStore();

  const [categoriesOpenState, setCategoriesOpenState] = useState(false);
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [saveArticleDialog, setSaveArticleDialog] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: '???????????? ??????????????????',
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
    setSaveArticleDialog(false);
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
      isOpen: true,
      message: '?????????? ????????????????',
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

        setSaveArticleDialog(true);
      })
      .catch(error => {
        setArticleLoading(false);
        setSnackbarState(prev => ({
          ...prev,
          isOpen: true,
          message: `????????????: ${error}`,
          alert: 'error',
        }));
      });
  };

  return (
    <Main>
      <PageTitle>???????????????? ????????????</PageTitle>
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
                  <CustomInputLabel>???????????????? ????????????:</CustomInputLabel>
                  <InputComponent
                    small
                    formControl={control}
                    name="title"
                    placeholder="?????????????? ????????????????"
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
                  <CustomInputLabel>?????????????? ????????????????:</CustomInputLabel>
                  <InputComponent
                    small
                    formControl={control}
                    name="description"
                    placeholder="?????????????? ????????????????"
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
                  <CustomInputLabel>??????????????????????????:</CustomInputLabel>
                  <SelectComponent
                    small
                    id="role-select"
                    name="roles"
                    options={userRolesOptions}
                    formControl={control}
                    multipleChoice
                    error={!!formState.errors.roles}
                    errorMessage={
                      !!formState.errors.roles && '???????????????? ??????????????????????????'
                    }
                    placeholder="???????????????? ??????????????????????????"
                  />
                </InputContainer>
                <InputContainer>
                  <CustomInputLabel>?????????????????? ????????????</CustomInputLabel>
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
                    placeholder="??????????????????"
                    error={!!formState.errors.categories}
                    errorMessage={
                      !!formState.errors.categories && '???????????????? ??????????????????????????'
                    }
                  />
                  <IconButton
                    color="primary"
                    sx={{ width: '50px', height: '50px', marginLeft: '10px' }}
                    onClick={() => setCategoriesOpenState(true)}
                  >
                    <AddIcon fontSize="large" />
                  </IconButton>
                </InputContainer>
                <InputContainer>
                  <CustomInputLabel>???????????????????? ????????????</CustomInputLabel>
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
                ??????????????????
              </LoadingButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => resetForm()}
              >
                ????????????????
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <CategoriesDialog
        store={adminStore}
        isOpen={categoriesOpenState}
        handleClose={() => setCategoriesOpenState(false)}
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
