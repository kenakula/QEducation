/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import InputComponent from 'app/components/input-component/input-component';
import SelectComponent from 'app/components/select-component/select-component';
import { InputType } from 'app/constants/input-type';
import { OpenState } from 'app/constants/open-state';
import { UserRole, userRolesOptions } from 'app/constants/user-roles';
import { VebinarModel } from 'app/constants/vebinar-model';
import {
  CustomInputLabel,
  InputContainer,
} from 'app/pages/admin-articles-editor/sub-components/elements';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { getYoutubeVideoId } from 'app/utils/youtube-helpers';
import { Timestamp } from 'firebase/firestore';
import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DialogTitleContainer from './dialog-title-container';

const schema = yup.object({
  title: yup.string().required('Это поле обязательно'),
  description: yup.string(),
  roles: yup.array(),
  link: yup.string().required('Это поле обязательно'),
});

interface Props {
  openState: OpenState;
  onClose: () => void;
  vebinar?: VebinarModel;
}

interface VebinarEditorFormModel {
  title: string;
  description?: string;
  roles: UserRole[];
  link: string;
}

const VebinarEditorDialog = observer((props: Props): JSX.Element => {
  const { openState, onClose, vebinar } = props;

  const adminStore = useAdminStore();
  const store = useMainPageStore();

  const {
    control,
    handleSubmit,
    formState,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<VebinarEditorFormModel>({
    defaultValues: {
      title: '',
      description: '',
      roles: [],
      link: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (vebinar) {
      setValue('title', vebinar.title);
      setValue('description', vebinar.description);
      setValue('roles', vebinar.roles);
      setValue('link', vebinar.link);
    }
  }, [vebinar]);

  const onSubmit = (data: VebinarEditorFormModel): void => {
    const obj: VebinarModel = {
      ...data,
      createdDate: Timestamp.now(),
      id: vebinar ? vebinar.id : nanoid(),
    };

    adminStore.addVebinar(obj).then(() => {
      reset();
      store.fetchVebinars();
      onClose();
    });
  };

  return (
    <Dialog
      open={openState === OpenState.Opened}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitleContainer onClose={onClose}>
        <Typography sx={{ fontSize: '24px', paddingRight: '40px' }}>
          Создайте и сохрание вебинар
        </Typography>
      </DialogTitleContainer>
      <DialogContent>
        <InputContainer sx={{ pt: 2 }}>
          <CustomInputLabel>Название</CustomInputLabel>
          <InputComponent
            type={InputType.Text}
            placeholder="Введите название"
            formControl={control}
            name="title"
            error={!!formState.errors.title}
            errorMessage={
              !!formState.errors.title
                ? formState.errors.title.message
                : undefined
            }
          />
        </InputContainer>
        <InputContainer>
          <CustomInputLabel>Сыылка на видео</CustomInputLabel>
          <InputComponent
            type={InputType.Text}
            placeholder="Вставьте ссылку из youtube"
            formControl={control}
            name="link"
            error={!!formState.errors.link}
            errorMessage={
              !!formState.errors.link
                ? formState.errors.link.message
                : undefined
            }
          />
        </InputContainer>
        <InputContainer>
          <CustomInputLabel>Описание</CustomInputLabel>
          <InputComponent
            type={InputType.Text}
            placeholder="Введите краткое описание"
            formControl={control}
            name="description"
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
            placeholder="Выберите специальности"
          />
        </InputContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {watch('link') ? (
            <iframe
              title={getValues('title')}
              src={`http://www.youtube.com/embed/${getYoutubeVideoId(
                getValues('link'),
              )}`}
              frameBorder="0"
              width="640"
              height="360"
            />
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => reset()} color="warning">
          Очистить
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>Сохранить</Button>
        <Button color="error" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default VebinarEditorDialog;
