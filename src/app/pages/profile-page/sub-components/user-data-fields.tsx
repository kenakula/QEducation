/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { Alert, Box, Typography } from '@mui/material';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { InputRow, InputContainer } from './styled-elements';
import { InputComponent } from 'app/components/form-controls';
import { InputType } from 'app/constants/input-type';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import ReAuthUserDialog, { ReAuthStateProps } from './re-auth-user-dialog';

interface EmailFormModel {
  email: string;
}

interface PasswordFormModel {
  password: string;
}

const emailFormSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректно почту')
    .required('Поле обязательное'),
});

const passwordFormSchema = yup.object({
  password: yup.string().required('Поле обязательное'),
});

const UserDataFields = (): JSX.Element => {
  const {
    actionProcesing,
    changeEmail,
    changePassword,
    errorMessage,
    setErrorMessage,
  } = useAuthStore();

  const [reAuthState, setReAuthState] = useState<ReAuthStateProps>({
    open: false,
    successCb: () => {},
    handleClose: () => {},
  });
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: '',
    alert: 'success',
  });

  useEffect(() => {
    if (setErrorMessage) {
      setErrorMessage('');
    }
  }, []);

  const handleReAuthClose = (): void => {
    setReAuthState(prev => ({
      ...prev,
      open: false,
    }));
  };

  const setReauthStateProps = (cb: () => void): void => {
    setReAuthState(prev => ({
      ...prev,
      open: true,
      handleClose: handleReAuthClose,
      successCb: cb,
    }));
  };

  const {
    control: emailControl,
    formState: emailFormState,
    reset: emailReset,
    handleSubmit: emailSubmit,
  } = useForm<EmailFormModel>({
    defaultValues: { email: '' },
    resolver: yupResolver(emailFormSchema),
  });

  const onEmailSubmit = (data: EmailFormModel): void => {
    if (changeEmail) {
      changeEmail(data.email, () => {
        setSnackbarState(prev => ({
          ...prev,
          isOpen: true,
          message: 'Почта изменена',
        }));
        emailReset();
      });
    }
  };

  const {
    control: passControl,
    formState: passFormState,
    reset: passReset,
    handleSubmit: passSubmit,
  } = useForm<PasswordFormModel>({
    defaultValues: { password: '' },
    resolver: yupResolver(passwordFormSchema),
  });

  const onPassSubmit = (data: PasswordFormModel): void => {
    const callback = (): void => {
      if (changePassword) {
        changePassword(data.password, () => {
          setSnackbarState(prev => ({
            ...prev,
            isOpen: true,
            message: 'Пароль изменен',
          }));
          passReset();
        });
      }
    };

    setReauthStateProps(callback);
  };

  return (
    <Box>
      {errorMessage && (
        <Alert sx={{ mb: 2 }} severity="error">
          {errorMessage}
        </Alert>
      )}
      <InputRow component="form" onSubmit={emailSubmit(onEmailSubmit)}>
        <Typography>Сменить почту</Typography>
        <InputContainer>
          <InputComponent
            small
            formControl={emailControl}
            type={InputType.Email}
            placeholder="Новая почта"
            name="email"
            error={!!emailFormState.errors.email}
            errorMessage={
              emailFormState.errors.email && emailFormState.errors.email.message
            }
          />
          <LoadingButton
            type="submit"
            size="small"
            variant="contained"
            startIcon={<SaveIcon />}
            loadingPosition="start"
            loading={actionProcesing}
            sx={{ ml: 2 }}
          >
            ОК
          </LoadingButton>
        </InputContainer>
      </InputRow>
      <InputRow component="form" onSubmit={passSubmit(onPassSubmit)}>
        <Typography>Сменить пароль</Typography>
        <InputContainer>
          <InputComponent
            small
            formControl={passControl}
            type={InputType.Password}
            placeholder="Новый пароль"
            name="password"
            error={!!passFormState.errors.password}
            errorMessage={
              passFormState.errors.password &&
              passFormState.errors.password.message
            }
          />
          <LoadingButton
            type="submit"
            size="small"
            variant="contained"
            startIcon={<SaveIcon />}
            loadingPosition="start"
            loading={actionProcesing}
            sx={{ ml: 2 }}
          >
            ОК
          </LoadingButton>
        </InputContainer>
      </InputRow>
      <ReAuthUserDialog {...reAuthState} handleClose={handleReAuthClose} />
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </Box>
  );
};

export default UserDataFields;
