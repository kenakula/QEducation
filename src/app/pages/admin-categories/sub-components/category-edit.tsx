import { Box, Button, Container, Typography } from '@mui/material';
import { Category } from 'app/constants/category-model';
import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { InfoBox } from './styled-elements';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputComponent } from 'app/components/form-controls';
import { InputType } from 'app/constants/input-type';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import {
  ModalDialogConfirm,
  ModalDialogConfirmStateProps,
} from 'app/components/modal-dialog';
import { categoryFormModel } from './category-form';

interface Props {
  category: Category | null;
  resetCategory: () => void;
}

const CategoryEdit = (props: Props): JSX.Element => {
  const { category, resetCategory } = props;
  const store = useAdminStore();

  const [updateState, setUpdateState] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Категория сохранена',
    alert: 'success',
  });
  const [deleteAction, setDeleteAction] =
    useState<ModalDialogConfirmStateProps>({
      id: '',
      isOpen: false,
    });

  const handleDelete = (): void => {
    if (!category) return;

    setDeleteAction(prev => ({
      ...prev,
      id: category.id,
      isOpen: true,
    }));
  };

  const onSubmit = (data: Category): void => {
    if (!category) return;

    setUpdateState(true);
    store.saveCategory({ ...data, id: category.id }).then(() => {
      setUpdateState(false);
      setSnackbarState(prev => ({
        ...prev,
        isOpen: true,
      }));
    });
  };

  const { control, formState, handleSubmit } = useForm<Category>({
    defaultValues: {
      title: category?.title,
      description: category?.description,
    },
    resolver: yupResolver(categoryFormModel),
  });

  return (
    <>
      <Button
        sx={{ marginLeft: 'auto' }}
        startIcon={<ArrowBackIcon />}
        color="inherit"
        onClick={resetCategory}
      >
        К категориям
      </Button>
      <Container maxWidth="sm">
        <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
          {category?.title}
        </Typography>
        <InfoBox component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography variant="h6" component="p">
              Название:
            </Typography>
            <Box>
              <InputComponent
                formControl={control}
                type={InputType.Text}
                name="title"
                error={!!formState.errors.title}
                errorMessage={
                  !!formState.errors.title
                    ? formState.errors.title.message
                    : undefined
                }
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" component="p">
              Описание:
            </Typography>
            <Box>
              <InputComponent
                formControl={control}
                type={InputType.Text}
                name="description"
                error={!!formState.errors.description}
                errorMessage={
                  !!formState.errors.description
                    ? formState.errors.description.message
                    : undefined
                }
              />
            </Box>
          </Box>
          <LoadingButton
            type="submit"
            loading={updateState}
            loadingPosition="start"
            sx={{ mt: 2, alignSelf: 'center' }}
            startIcon={<SaveIcon />}
            disabled={!formState.isDirty}
          >
            Сохранить
          </LoadingButton>
          <Button
            sx={{ mt: 2, alignSelf: 'center' }}
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Удалить
          </Button>
        </InfoBox>
      </Container>
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
          store.deleteCategory(deleteAction.id).then(() => {
            resetCategory();
          });
        }}
      />
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </>
  );
};

export default CategoryEdit;
