/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  useTheme,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from './sign-in-form';
import { CopyrightElement, TextLink } from './sub-components/elements';
import { Routes } from 'app/routes/routes';
import { InputComponent } from 'app/components/form-controls';
import { InputType } from 'app/constants/input-type';
import { useHistory } from 'react-router-dom';
import { SignInModel } from 'app/constants/sign-in-model';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { AuthStates } from 'app/constants/auth-state';

const SignInPage = observer((): JSX.Element => {
  const theme = useTheme();
  const history = useHistory();

  const { signIn, authState, errorMessage, actionProcesing, setErrorMessage } =
    useAuthStore();

  useEffect(() => {
    if (authState === AuthStates.Authorized) {
      history.push(Routes.MAIN);
    }
  }, [authState, history]);

  useEffect(() => {
    if (setErrorMessage) {
      setErrorMessage('');
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInModel>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = (data: SignInModel): void => {
    signIn!(data).then(() => {
      reset();
      history.push(Routes.MAIN);
    });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography sx={{ mb: 1 }} component="h1" variant="h5">
          Войти
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <InputComponent
            type={InputType.Email}
            formControl={control}
            name="email"
            error={!!errors.email}
            errorMessage={errors.email && errors.email.message}
            placeholder="Ваша почта"
            styles={{ marginBottom: theme.spacing(2) }}
          />
          <InputComponent
            type={InputType.Password}
            formControl={control}
            name="password"
            error={!!errors.password}
            errorMessage={errors.password && errors.password.message}
            placeholder="Введите пароль"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<ExitToAppIcon />}
            loadingPosition="start"
            loading={actionProcesing}
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <TextLink to={Routes.RESTORE_PASSWORD} sx={{ fontSize: 'small' }}>
                Забыли пароль?
              </TextLink>
            </Grid>
            <Grid item>
              <TextLink to={Routes.SIGN_UP} sx={{ fontSize: 'small' }}>
                Нет аккаунта? Зарегистрируйтесь.
              </TextLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CopyrightElement sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
});

export default SignInPage;
