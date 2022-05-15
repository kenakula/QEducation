/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Typography, Box } from '@mui/material';
import {
  CustomInputLabel,
  InputContainer,
} from 'app/pages/admin-articles-editor/sub-components/elements';
import { MainPageStore } from 'app/stores/main-page-store/main-page-store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { observer } from 'mobx-react-lite';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { SelectComponent } from 'app/components/form-controls';
import { SortableList } from 'app/components/sortable-list';
import { ModalDialog } from 'app/components/modal-dialog';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { ArticleModel } from 'app/constants/article-model';

const schema = yup.object({
  categoryId: yup.string().required('Это поле обязательно'),
  list: yup.array(),
});

interface Props {
  store: MainPageStore;
  open: boolean;
  onClose: () => void;
  list?: CategoryArticle[];
}

export interface UserCategoriesFormModel {
  categoryId: string;
  list: CategoryArticle[];
}

const UserCategoriesDialog = observer((props: Props): JSX.Element => {
  const { store, open, onClose, list } = props;

  const adminStore = useAdminStore();

  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Категория сохранена',
    alert: 'success',
  });

  const { formState, control, watch, handleSubmit, setValue, reset } =
    useForm<UserCategoriesFormModel>({
      defaultValues: {
        categoryId: '',
        list: list ?? store.articles,
      },
      resolver: yupResolver(schema),
    });

  const watchCategory = watch('categoryId', '');

  useEffect(() => {
    if (adminStore.editingUserCategory) {
      setValue('categoryId', adminStore.editingUserCategory);
    }
  }, [adminStore.editingUserCategory]);

  const handleListChange = (newList: CategoryArticle[]): void => {
    setValue('list', newList);
  };

  const getCategoryArticles = (
    arr: ArticleModel[] | CategoryArticle[],
  ): CategoryArticle[] =>
    arr.map(item => ({
      id: item.id,
      description: item.description,
      title: item.title,
    }));

  const onSubmit = (data: UserCategoriesFormModel): void => {
    const filteredArticles = data.list.filter(
      item => !adminStore.excludedArticlesFromCategoryList.includes(item.id),
    );

    const resultArr = getCategoryArticles(filteredArticles);

    adminStore
      .setUserCategory(store.selectedRole, {
        ...data,
        list: resultArr,
      })
      .then(() => {
        reset();
        setValue('list', []);
        store.resetArticles();
        adminStore.setEditingUserCategory('');
      })
      .then(() => {
        setSnackbarState(prev => ({
          ...prev,
          isOpen: true,
        }));
        store.getUserCategories(store.selectedRole);
      });
  };

  useEffect(() => {
    store.fetchArticlesByCategory(watchCategory);
    setValue('list', []);
  }, [watchCategory]);

  const ModalActions = (): JSX.Element => (
    <>
      <Button onClick={handleSubmit(onSubmit)}>Сохранить</Button>
      <Button color="error" onClick={onClose}>
        Закрыть
      </Button>
    </>
  );

  return (
    <>
      <ModalDialog
        maxWidth="md"
        isOpen={open}
        handleClose={onClose}
        title={`Выберите и наполните категорию для роли: ${store.selectedRole}`}
        actions={<ModalActions />}
      >
        <InputContainer sx={{ pt: 2 }}>
          <CustomInputLabel>Категория</CustomInputLabel>
          <SelectComponent
            id="user-categories-category-select"
            formControl={control}
            name="categoryId"
            options={store.categories.map((item: Category) => ({
              label: item.title,
              value: item.id,
            }))}
            placeholder="Категория"
            error={!!formState.errors.categoryId}
            errorMessage={
              formState.errors.categoryId
                ? formState.errors.categoryId.message
                : undefined
            }
          />
        </InputContainer>
        <Box>
          {store.articles.length ? (
            <Box sx={{ overflowX: 'hidden' }}>
              <SortableList<CategoryArticle>
                onChange={handleListChange}
                list={store.articles}
              />
            </Box>
          ) : (
            <Typography
              sx={{ mt: 2 }}
              textAlign="center"
              color="text.secondary"
            >
              нет статей в категории
            </Typography>
          )}
        </Box>
      </ModalDialog>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </>
  );
});

export default UserCategoriesDialog;
