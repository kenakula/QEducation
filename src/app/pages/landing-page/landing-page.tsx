import React, { useEffect } from 'react';
import Main from 'app/components/main/main';
import { Button, Grid, Typography } from '@mui/material';
import { PromoBlock } from './sub-components/styled-elements';
import { observer } from 'mobx-react-lite';
import { ReactComponent as EducationIcon } from 'assets/images/education-image.svg';
import { Link } from 'react-router-dom';
import { Routes } from 'app/routes/routes';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { AuthStates } from 'app/constants/auth-state';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';

const LandingPage = observer((): JSX.Element => {
  const { authState } = useAuthStore();
  const store = useMainPageStore();

  useEffect(() => {
    if (!store.isInited) {
      store.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.isInited]);

  useEffect(() => {
    if (store.profileInfo) {
      store.getUserImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.profileInfo]);

  return (
    <Main>
      <PromoBlock component="section">
        <Grid container spacing={{ xs: 4, sm: 2 }} alignItems="center">
          <Grid item sm={8}>
            <Typography variant="h2">Добро пожаловать!</Typography>
            <Typography>
              Обучающий портал QEducation. Здесь можно найти множество статей,
              обзоров и вебинаров про работу в QClinic
            </Typography>
            {authState === AuthStates.Authorized ? (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={Routes.MAIN}
              >
                К материалам
              </Button>
            ) : authState === AuthStates.NotAuthorized ? (
              <Typography color="text.secondary">
                Чтобы получить доступ к материалам, пожалуйста,{' '}
                <Link to={Routes.SIGN_IN}>войдите</Link> в свой профиль или{' '}
                <Link to={Routes.SIGN_UP}>зарегистрируйтесь</Link>.
              </Typography>
            ) : null}
          </Grid>
          <Grid item sm={4}>
            <EducationIcon />
          </Grid>
        </Grid>
      </PromoBlock>
    </Main>
  );
});

export default LandingPage;
