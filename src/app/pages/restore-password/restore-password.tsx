/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { restorePasswordForm } from './restore-password-form';
import { CopyrightElement, TextLink } from './sub-components/elements';
import { Routes } from 'app/routes/routes';
import { InputComponent } from 'app/components/form-controls';
import { InputType } from 'app/constants/input-type';
import { SignInModel } from 'app/constants/sign-in-model';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { ResetPasswordModel } from 'app/constants/reset-password-model';
import LockResetIcon from '@mui/icons-material/LockReset';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { OpenState } from 'app/constants/open-state';
import { SnackbarAlert } from 'app/components/snackbar-alert';

const RestorePasswordPage = observer((): JSX.Element => {
  const theme = useTheme();

  const { errorMessage, actionProcesing, resetPassword, setErrorMessage } =
    useAuthStore();
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Проверьте почту',
    alert: 'success',
  });

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
    defaultValues: { email: '' },
    resolver: yupResolver(restorePasswordForm),
  });

  const onSubmit = (data: ResetPasswordModel): void => {
    if (resetPassword) {
      resetPassword(data.email, () => {
        setSnackbarState(prev => ({
          ...prev,
          openState: OpenState.Opened,
        }));
      });
      reset();
    }
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
          Сбросить пароль
        </Typography>
        <Typography sx={{ mb: 2 }} variant="caption" textAlign="center">
          На указанную почту будет отправлено письмо с инструкцией к сбросу
          пароля
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <InputComponent
            type={InputType.Email}
            formControl={control}
            name="email"
            error={!!errors.email}
            errorMessage={errors.email && errors.email.message}
            placeholder="Введите почту"
            styles={{ marginBottom: theme.spacing(2) }}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<LockResetIcon />}
            loadingPosition="start"
            loading={actionProcesing}
            sx={{ mb: 2 }}
          >
            ОК
          </LoadingButton>
          <Grid container>
            <Grid item>
              <TextLink to={Routes.SIGN_UP} sx={{ fontSize: 'small' }}>
                Нет аккаунта? Зарегистрируйтесь.
              </TextLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CopyrightElement sx={{ mt: 8, mb: 4 }} />
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </Container>
  );
});

export default RestorePasswordPage;
