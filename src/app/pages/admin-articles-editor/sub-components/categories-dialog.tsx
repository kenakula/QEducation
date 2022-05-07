import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { OpenState } from 'app/constants/open-state';
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

const DialogElement = styled(Dialog)(({ theme }) => ({
  ...theme.typography.body1,
  '.MuiPaper-root': { padding: theme.spacing(3), width: '100%' },
}));

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
  openState: OpenState;
  handleClose: () => void;
  store: AdminStore;
}

const CategoriesDialog = observer((props: Props): JSX.Element => {
  const { openState, handleClose, store } = props;

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

  return (
    <DialogElement open={openState === OpenState.Opened} onClose={handleClose}>
      <DialogTitle>Список категорий статей</DialogTitle>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ ml: 2, alignSelf: 'flex-end' }}
        >
          Создать
        </Button>
      </Box>
    </DialogElement>
  );
});

export default CategoriesDialog;
