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
import InputComponent from 'app/components/input-component/input-component';
import { Category, CategoryArticle } from 'app/constants/category-model';

const DialogElement = styled(Dialog)(({ theme }) => ({
  ...theme.typography.body1,
  '.MuiPaper-root': { padding: theme.spacing(3), width: '100%' },
}));

const formShchema = yup.object({
  label: yup.string().required('Введите название'),
  description: yup.string().required('Введите описание'),
});

interface FormModel {
  label: string;
  description: string;
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
        label: '',
        description: '',
        articles: [],
      },
      resolver: yupResolver(formShchema),
    });

  const onSave = (data: FormModel): void => {
    const isSameName = store.categories.some(item => item.label === data.label);

    if (isSameName) {
      setError('label', { message: 'Такая категория существует' });
      return;
    }

    store.saveCategory(data);
    reset();
  };

  return (
    <DialogElement open={openState === OpenState.Opened} onClose={handleClose}>
      <DialogTitle>Список категорий статей</DialogTitle>
      <List sx={{ pt: 0, maxHeight: '300px', overflow: 'auto' }}>
        {store.categories.length ? (
          store.categories.map((item: Category) => (
            <ListItem key={item.label}>
              <ListItemText primary={item.label} />
              <ListItemIcon>
                <IconButton
                  color="error"
                  onClick={() => store.deleteCategory(item.label)}
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
            name="label"
            error={!!formState.errors.label}
            errorMessage={
              !!formState.errors.label
                ? formState.errors.label.message
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
