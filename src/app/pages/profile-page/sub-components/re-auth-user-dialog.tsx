/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, DialogContentText } from '@mui/material';
import { InputComponent } from 'app/components/form-controls';
import { InputType } from 'app/constants/input-type';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ModalDialog } from 'app/components/modal-dialog';

export const reAuthSchema = yup.object({
  email: yup
    .string()
    .email('Почта введена неправильно')
    .required('Это обязательное поле'),
  password: yup
    .string()
    .min(4, 'Введите не менее 6 символов')
    .required('Это обязательное поле'),
});

// eslint-disable-next-line no-shadow
export enum ReAuthType {
  Email = 'email',
  Password = 'password',
}

export interface ReAuthModel {
  email: string;
  password: string;
}

export interface ReAuthStateProps {
  open: boolean;
  handleClose: () => void;
  successCb: () => void;
}

const ReAuthUserDialog = (props: ReAuthStateProps): JSX.Element => {
  const { open, handleClose, successCb } = props;

  const { errorMessage, actionProcesing, setErrorMessage, reauthenticateUser } =
    useAuthStore();

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
  } = useForm<ReAuthModel>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(reAuthSchema),
  });

  const onSubmit = ({ email, password }: ReAuthModel): void => {
    if (!reauthenticateUser) {
      return;
    }

    reauthenticateUser(email, password).then(() => {
      successCb();
      reset();
      handleClose();

      if (setErrorMessage) {
        setErrorMessage('');
      }
    });
  };

  const ModalActions = React.memo(
    (): JSX.Element => (
      <>
        <LoadingButton
          variant="contained"
          startIcon={<ExitToAppIcon />}
          loadingPosition="start"
          loading={actionProcesing}
          sx={{ mt: 2 }}
          onClick={handleSubmit(onSubmit)}
        >
          ОК
        </LoadingButton>
        <Button color="error" variant="outlined" onClick={handleClose}>
          Отменить
        </Button>
      </>
    ),
  );

  return (
    <ModalDialog
      isOpen={open}
      handleClose={handleClose}
      title="Введите свои данные для входа"
      actions={<ModalActions />}
    >
      <DialogContentText sx={{ mb: 2 }} id="alert-dialog-description">
        Введите ваши данные снова, пожалуйста. Это необходимо в целях
        безопасности.
      </DialogContentText>
      <Box>
        {errorMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errorMessage}
          </Alert>
        )}
      </Box>
      <InputComponent
        type={InputType.Email}
        formControl={control}
        name="email"
        error={!!errors.email}
        errorMessage={errors.email && errors.email.message}
        placeholder="Ваша почта"
        styles={{ marginBottom: '20px' }}
      />
      <InputComponent
        type={InputType.Password}
        formControl={control}
        name="password"
        error={!!errors.password}
        errorMessage={errors.password && errors.password.message}
        placeholder="Введите пароль"
      />
    </ModalDialog>
  );
};

export default ReAuthUserDialog;
