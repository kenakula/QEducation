import React from 'react';
import Main from 'app/components/main/main';
import { Button, Grid, Typography } from '@mui/material';
import { PromoBlock } from './sub-components/styled-elements';

import { ReactComponent as EducationIcon } from 'assets/images/education-image.svg';
import { Link } from 'react-router-dom';
import { Routes } from 'app/routes/routes';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { AuthStates } from 'app/constants/auth-state';

const LandingPage = (): JSX.Element => {
  const { authState } = useAuthStore();

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
                Начать учиться
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
};

export default LandingPage;
