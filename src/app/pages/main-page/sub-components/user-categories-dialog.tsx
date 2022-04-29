/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Box,
} from '@mui/material';
import SelectComponent from 'app/components/select-component/select-component';
import { OpenState } from 'app/constants/open-state';
import {
  CustomInputLabel,
  InputContainer,
} from 'app/pages/admin-articles-editor/sub-components/elements';
import { MainPageStore } from 'app/stores/main-page-store/main-page-store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DialogTitleContainer from './dialog-title-container';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { observer } from 'mobx-react-lite';
import SortableList from 'app/components/sortable-list/sortable-list';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';

const schema = yup.object({
  category: yup.string().required('Это поле обязательно'),
  list: yup.array(),
});

interface Props {
  store: MainPageStore;
  openState: OpenState;
  onClose: () => void;
  list?: CategoryArticle[];
}

export interface UserCategoriesFormModel {
  category: string;
  list: CategoryArticle[];
}

const UserCategoriesDialog = observer((props: Props): JSX.Element => {
  const { store, openState, onClose, list } = props;

  const adminStore = useAdminStore();

  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    openState: OpenState.Closed,
    message: 'Категория сохранена',
    alert: 'success',
  });

  const { formState, control, watch, handleSubmit, setValue, reset } =
    useForm<UserCategoriesFormModel>({
      defaultValues: {
        category: '',
        list: list ?? store.articles,
      },
      resolver: yupResolver(schema),
    });

  const watchCategory = watch('category', '');

  useEffect(() => {
    if (adminStore.editingUserCategory) {
      setValue('category', adminStore.editingUserCategory);
    }
  }, [adminStore.editingUserCategory]);

  const handleListChange = (newList: CategoryArticle[]): void => {
    setValue('list', newList);
  };

  const onSubmit = (data: UserCategoriesFormModel): void => {
    const finalArr = data.list.filter(
      item => !adminStore.excludedArticlesFromCategoryList.includes(item.id),
    );

    adminStore
      .setUserCategory(data.category, store.selectedRole, {
        ...data,
        list: finalArr,
      })
      .then(() => {
        store.fetchRoles();
        reset();
        setValue('list', []);
        store.resetArticles();
        adminStore.setEditingUserCategory('');
        store.getUserCategories(store.selectedRole);
      })
      .then(() => {
        setSnackbarState(prev => ({
          ...prev,
          openState: OpenState.Opened,
        }));
      });
  };

  useEffect(() => {
    store.fetchArticlesByCategory(watchCategory);
    setValue('list', []);
  }, [watchCategory]);

  return (
    <Dialog
      open={openState === OpenState.Opened}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitleContainer onClose={onClose}>
        <Typography sx={{ fontSize: '24px', paddingRight: '40px' }}>
          Выберите и наполните категорию для роли:{' '}
          <Typography
            sx={{ fontSize: '24px' }}
            variant="caption"
            color="primary"
          >
            {store.selectedRole}
          </Typography>
        </Typography>
      </DialogTitleContainer>
      <DialogContent>
        <InputContainer sx={{ pt: 2 }}>
          <CustomInputLabel>Категория</CustomInputLabel>
          <SelectComponent
            id="user-categories-category-select"
            formControl={control}
            name="category"
            options={store.categories.map((item: Category) => ({
              label: item.title,
              value: item.id,
            }))}
            placeholder="Категория"
            error={!!formState.errors.category}
            errorMessage={
              formState.errors.category
                ? formState.errors.category.message
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)}>Сохранить</Button>
        <Button color="error" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </Dialog>
  );
});

export default UserCategoriesDialog;
