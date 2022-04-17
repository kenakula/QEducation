/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import SelectComponent from 'app/components/select-component/select-component';
import { OpenState } from 'app/constants/open-state';
import { UserRole } from 'app/constants/user-roles';
import {
  CustomInputLabel,
  InputContainer,
} from 'app/pages/admin-articles-editor/sub-components/elements';
import { MainPageStore } from 'app/stores/main-page-store/main-page-store';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DialogTitleContainer from './dialog-title-container';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Category } from 'app/constants/category-model';
import { observer } from 'mobx-react-lite';

const schema = yup.object({
  category: yup.string().required('Это поле обязательно'),
});

interface Props {
  store: MainPageStore;
  role: UserRole;
  openState: OpenState;
  onClose: () => void;
}

export interface UserCategoriesFormModel {
  category: string;
}

const UserCategoriesDialog = observer((props: Props): JSX.Element => {
  const { store, role, openState, onClose } = props;

  const { formState, control, watch } = useForm<UserCategoriesFormModel>({
    defaultValues: {
      category: '',
    },
    resolver: yupResolver(schema),
  });

  const watchCategory = watch('category', '');

  useEffect(() => {
    store.fetchArticlesByCategory(watchCategory);
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
            {role}
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
        <ul>
          {store.articles.map(item => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button>Сохранить</Button>
        <Button color="error" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserCategoriesDialog;
