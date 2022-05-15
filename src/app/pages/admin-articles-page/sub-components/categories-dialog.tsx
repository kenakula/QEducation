import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InputType } from 'app/constants/input-type';
import { AdminStore } from 'app/stores/admin-store/admin-store';
import { InputComponent } from 'app/components/form-controls';
import { Category, CategoryArticle } from 'app/constants/category-model';
import { nanoid } from 'nanoid';
import { ModalDialog } from 'app/components/modal-dialog';

const formShchema = yup.object({
  title: yup.string().required('Введите название'),
  description: yup.string(),
});

interface FormModel {
  title: string;
  description?: string;
  articles: CategoryArticle[];
}

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  store: AdminStore;
}

export const CategoriesDialog = observer((props: Props): JSX.Element => {
  const { isOpen, handleClose, store } = props;

  const { control, handleSubmit, formState, reset, setError } =
    useForm<FormModel>({
      defaultValues: {
        title: '',
        description: '',
        articles: [],
      },
      resolver: yupResolver(formShchema),
    });

  const onSave = (data: FormModel): void => {
    const isSameName = store.categories.find(item => item.title === data.title);

    if (isSameName) {
      setError('title', { message: 'Такая категория существует' });
      return;
    }

    store.saveCategory({ ...data, id: nanoid() });
    reset();
  };

  const ModalActions = (): JSX.Element => (
    <Button
      type="button"
      onClick={handleSubmit(onSave)}
      color="primary"
      sx={{ ml: 2, alignSelf: 'flex-end' }}
    >
      Создать
    </Button>
  );

  return (
    <ModalDialog
      isOpen={isOpen}
      title="Список категорий статей"
      handleClose={handleClose}
      actions={<ModalActions />}
    >
      <List sx={{ pt: 0, maxHeight: '300px', overflow: 'auto' }}>
        {store.categories.length ? (
          store.categories.map((item: Category) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.title}
                secondary={item.description ?? undefined}
              />
              <ListItemIcon>
                <IconButton
                  color="error"
                  onClick={() => store.deleteCategory(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemIcon>
            </ListItem>
          ))
        ) : (
          <Typography>Нет категорий</Typography>
        )}
      </List>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Добавить новую категорию
      </Typography>
      <Box
        component="form"
        sx={{ display: 'flex' }}
        onSubmit={handleSubmit(onSave)}
      >
        <Box sx={{ display: 'grid', gap: '10px', width: '100%' }}>
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
            placeholder="Введите название"
          />
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
            placeholder="Введите описание"
          />
        </Box>
      </Box>
    </ModalDialog>
  );
});
