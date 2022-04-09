import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signUpSchema } from './sign-up-form';
import { CopyrightElement, TextLink } from './sub-components/elements';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Routes } from 'app/routes/routes';
import { InputType } from 'app/constants/input-type';
import InputComponent from 'app/components/input-component/input-component';
import { LoadingButton } from '@mui/lab';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { SignUpModel } from 'app/constants/sign-up-model';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { useHistory } from 'react-router-dom';
import { AuthStates } from 'app/constants/auth-state';
import SelectComponent from 'app/components/select-component/select-component';
import { UserRole, userRolesOptions } from 'app/constants/user-roles';

interface SignUpFormModel extends SignUpModel {
  passwordConfirm?: string;
}

const SignUpPage = observer((): JSX.Element => {
  const theme = useTheme();
  const history = useHistory();
  const { signUp, authState, actionProcesing, errorMessage } = useAuthStore();

  useEffect(() => {
    if (authState === AuthStates.Authorized) {
      history.push(Routes.MAIN);
    }
  }, [authState, history]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormModel>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      role: UserRole.None,
    },
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormModel): void => {
    const model = data;
    delete model.passwordConfirm;

    signUp!(model).then(() => {
      reset();
      history.push(Routes.PROFILE);
    });
  };

  return (
    <Container
      component="main"
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
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <InputComponent
                type={InputType.Text}
                formControl={control}
                name="firstName"
                error={!!errors.firstName}
                errorMessage={errors.firstName && errors.firstName.message}
                placeholder="Ваше имя"
                styles={{ marginBottom: theme.spacing(1) }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputComponent
                type={InputType.Text}
                formControl={control}
                name="lastName"
                error={!!errors.lastName}
                errorMessage={errors.lastName && errors.lastName.message}
                placeholder="Ваша фамилия"
                styles={{ marginBottom: theme.spacing(1) }}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectComponent
                id="sign-up-role-select"
                name="role"
                options={userRolesOptions}
                formControl={control}
                error={!!errors.role}
                errorMessage={errors.role && errors.role.message}
                placeholder="Выберите специальность"
                styles={{ marginBottom: theme.spacing(1) }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputComponent
                type={InputType.Email}
                formControl={control}
                name="email"
                error={!!errors.email}
                errorMessage={errors.email && errors.email.message}
                placeholder="Ваша почта"
                styles={{ marginBottom: theme.spacing(1) }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputComponent
                type={InputType.Password}
                formControl={control}
                name="password"
                error={!!errors.password}
                errorMessage={errors.password && errors.password.message}
                placeholder="Введите пароль"
                styles={{ marginBottom: theme.spacing(1) }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputComponent
                type={InputType.Password}
                formControl={control}
                name="passwordConfirm"
                error={!!errors.passwordConfirm}
                errorMessage={
                  errors.passwordConfirm && errors.passwordConfirm.message
                }
                placeholder="Повторите пароль"
                styles={{ marginBottom: theme.spacing(1) }}
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<ExitToAppIcon />}
            loadingPosition="start"
            loading={actionProcesing}
            sx={{ mt: 3, mb: 2 }}
          >
            Зарегистрироваться
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <TextLink to={Routes.SIGN_IN} sx={{ fontSize: 'small' }}>
                Есть аккаунт? Войти
              </TextLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CopyrightElement sx={{ mt: 5 }} />
    </Container>
  );
});

export default SignUpPage;
