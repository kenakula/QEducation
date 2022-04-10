import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import InputComponent from 'app/components/input-component/input-component';
import SelectComponent from 'app/components/select-component/select-component';
import { genderOptions } from 'app/constants/gender';
import { InputType } from 'app/constants/input-type';
import { UserModel } from 'app/constants/user-model';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SaveIcon from '@mui/icons-material/Save';
import SnackbarAlert from 'app/components/snackbar-alert/snackbar-alert';
import { OpenState } from 'app/constants/open-state';
import { InfoBox } from './styled-elements';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';

export const profileForm = yup.object({
  uid: yup.string(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  middleName: yup.string(),
  role: yup.string(),
  gender: yup.string(),
});

interface Props {
  data: UserModel;
  uploadState: boolean;
  updateFunction: (id: string, data: UserModel) => Promise<void>;
}

const MainInfoForm = (props: Props): JSX.Element => {
  const { data, uploadState, updateFunction } = props;

  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    openState: OpenState.Closed,
    message: 'Данные сохранены',
    alert: 'success',
  });

  const { control, formState, handleSubmit, reset } = useForm<UserModel>({
    defaultValues: data,
    resolver: yupResolver(profileForm),
  });

  const onSubmit = (user: UserModel): void => {
    updateFunction(user.uid, user)
      .then(() => {
        setSnackbarState(prev => ({
          ...prev,
          openState: OpenState.Opened,
        }));
      })
      .finally(() => reset(user));
  };

  return (
    <InfoBox component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h6" component="p">
          Имя:
        </Typography>
        <Box>
          <InputComponent
            formControl={control}
            type={InputType.Text}
            name="firstName"
            small
            error={!!formState.errors.firstName}
            errorMessage={
              !!formState.errors.firstName
                ? formState.errors.firstName.message
                : undefined
            }
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" component="p">
          Фамилия:
        </Typography>
        <Box>
          <InputComponent
            formControl={control}
            type={InputType.Text}
            name="lastName"
            small
            error={!!formState.errors.lastName}
            errorMessage={
              !!formState.errors.lastName
                ? formState.errors.lastName.message
                : undefined
            }
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" component="p">
          Отчество:
        </Typography>
        <Box>
          <InputComponent
            formControl={control}
            type={InputType.Text}
            name="middleName"
            small
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" component="p">
          Пол:
        </Typography>
        <Box>
          <SelectComponent
            id="gender-select"
            formControl={control}
            name="gender"
            options={genderOptions}
            small
          />
        </Box>
      </Box>
      <LoadingButton
        type="submit"
        loading={uploadState}
        loadingPosition="start"
        sx={{ mt: 2, alignSelf: 'center' }}
        startIcon={<SaveIcon />}
        disabled={!formState.isDirty}
      >
        Сохранить
      </LoadingButton>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </InfoBox>
  );
};

export default MainInfoForm;
