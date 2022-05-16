/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Box,
} from '@mui/material';
import { BootState } from 'app/constants/boot-state';
import { observer } from 'mobx-react-lite';
import PersonIcon from '@mui/icons-material/Person';
import MainInfoForm from './sub-components/main-info-form';
import {
  FileInput,
  PhotoContainer,
  ProfileInfoSection,
  UserPhoto,
} from './sub-components/styled-elements';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { Main } from 'app/components/main';
import { Loader } from 'app/components/loader';
import UserDataFields from './sub-components/user-data-fields';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { useFirebaseContext } from 'app/stores/firebase-store/firebase-store';
import { StorageFolder } from 'app/constants/storage-folder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { UserAssignments } from './sub-components/user-assignments';

const MAX_IMAGE_SIZE = 2e6;

const ProfilePage = observer((): JSX.Element => {
  const store = useMainPageStore();
  const firebase = useFirebaseContext();

  const [imageUploading, setImageUploading] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Аватар обновлен',
    alert: 'success',
  });

  useEffect(() => {
    if (!store.isInited) {
      store.init();
    }
  }, [store.isInited]);

  const handleDeleteImage = (): void => {
    setImageUploading(true);
    firebase
      .deleteFile(`${StorageFolder.UserAvatars}/${store.profileInfo.uid}`)
      .then(() => {
        setImageUploading(false);
        store.setProfileImageUrl('');
      });
  };

  const onInputFileSelect = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedFiles = evt.target.files;
    const file =
      selectedFiles && selectedFiles.length ? selectedFiles[0] : null;

    if (!file) {
      return;
    }

    if (file.size >= MAX_IMAGE_SIZE) {
      setSnackbarState(prev => ({
        ...prev,
        isOpen: true,
        alert: 'error',
        message: 'Изображение слишком большого размера',
      }));

      return;
    }
    setImageUploading(true);

    firebase
      .uploadFile(`${StorageFolder.UserAvatars}/${store.profileInfo.uid}`, file)
      .then(() => {
        store.getUserImage();
        setSnackbarState(prev => ({
          ...prev,
          isOpen: true,
        }));
        setImageUploading(false);
      })
      .catch(() => {
        setSnackbarState(prev => ({
          ...prev,
          isOpen: true,
          alert: 'error',
          message: 'Неизвестная ошибка, попробуйте позже',
        }));
      });
  };

  return (
    <Main>
      <ProfileInfoSection>
        {store.bootState === BootState.Success ? (
          <Grid rowSpacing={2} columnSpacing={4} container>
            <Grid item xs={12} md={3}>
              <PhotoContainer>
                <UserPhoto variant="rounded" src={store.profileImageUrl}>
                  <PersonIcon />
                </UserPhoto>
                <Box>
                  <Tooltip title="Не более 2 Mb">
                    <label htmlFor="contained-button-file">
                      <FileInput
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        onChange={onInputFileSelect}
                      />
                      <Button
                        component="span"
                        size="small"
                        disabled={imageUploading}
                      >
                        Загрузить
                      </Button>
                    </label>
                  </Tooltip>
                  {store.profileImageUrl.length ? (
                    <IconButton
                      sx={{ ml: 2 }}
                      size="small"
                      onClick={handleDeleteImage}
                      disabled={imageUploading}
                      color="error"
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                </Box>
              </PhotoContainer>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography mb={2} variant="h5" component="h2">
                Основная информация:
              </Typography>
              {store.profileInfo ? (
                <MainInfoForm
                  data={store.profileInfo}
                  uploadState={store.profileInfoUpdating}
                  updateFunction={store.updateUserInfo}
                />
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Typography mb={2} mt={2} variant="h5" component="h2">
                Назначенные материалы:
              </Typography>
              <UserAssignments />
            </Grid>
            <Grid item xs={12}>
              <Typography mb={2} mt={2} variant="h5" component="h2">
                Пользовательские данные:
              </Typography>
              <UserDataFields />
            </Grid>
          </Grid>
        ) : (
          <Loader />
        )}
      </ProfileInfoSection>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </Main>
  );
});

export default ProfilePage;
