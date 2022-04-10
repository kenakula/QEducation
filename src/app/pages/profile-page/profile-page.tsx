import React, { useEffect } from 'react';
import { Grid, Typography, Skeleton, Stack, Button } from '@mui/material';
import { BootState } from 'app/constants/boot-state';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { observer } from 'mobx-react-lite';
import PersonIcon from '@mui/icons-material/Person';
import MainInfoForm from './sub-components/main-info-form';
import {
  PhotoContainer,
  ProfileInfoSection,
  UserPhoto,
} from './sub-components/styled-elements';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import Main from 'app/components/main/main';

const ProfilePage = observer((): JSX.Element => {
  const store = useMainPageStore();

  useEffect(() => {
    store.init();
  }, [store]);

  return (
    <Main>
      <ProfileInfoSection>
        {store.bootState === BootState.Success ? (
          <Grid rowSpacing={2} columnSpacing={4} alignItems="center" container>
            <Grid item xs={12} md={3}>
              <PhotoContainer>
                <UserPhoto variant="rounded">
                  <PersonIcon />
                </UserPhoto>
                <Button size="small">Изменить</Button>
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
          </Grid>
        ) : (
          <Grid spacing={2} container>
            <Grid item xs={12} md={3}>
              <Skeleton width="100%" height={400} />
            </Grid>
            <Grid item xs={12} md={9}>
              <Skeleton width="100%" height={400} />
            </Grid>
          </Grid>
        )}
      </ProfileInfoSection>
    </Main>
  );
});

export default ProfilePage;
