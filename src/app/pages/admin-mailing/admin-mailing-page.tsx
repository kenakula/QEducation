/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography, Box } from '@mui/material';
import { InputComponent, SelectComponent } from 'app/components/form-controls';
import { RadioButtonGroup } from 'app/components/form-controls/radio-button-group';
import { Main } from 'app/components/main';
import { PageTitle } from 'app/components/typography';
import { InputType } from 'app/constants/input-type';
import {
  attachmentEntityOptions,
  EntityModel,
  NotificationModel,
} from 'app/constants/notification-model';
import { severetyOptions } from 'app/constants/severety-options';
import { userRolesOptions } from 'app/constants/user-roles';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { getFio } from 'app/utils/text-helpers';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CenteredContentBox } from './sub-components/styled-elements';
import SendIcon from '@mui/icons-material/Send';
import { CheckboxComponent } from 'app/components/form-controls/checkbox-component';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import {
  getMailingList,
  getNotificationObject,
  MailingFormModel,
  mailingFormSchema,
  MailingTarget,
  mailTargetOptions,
} from './assets';
import { getButtonSeveretyColor } from 'app/utils/color-helpers';

const AdminMailingPage = (): JSX.Element => {
  const adminStore = useAdminStore();

  const [notificationSending, setNotificationSending] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Уведомления отправлены',
    alert: 'success',
  });

  useEffect(() => {
    if (!adminStore.isInited) {
      adminStore.init();
    }
  }, [adminStore.isInited]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MailingFormModel>({
    defaultValues: {
      target: MailingTarget.All,
      severety: 'primary',
      entity: EntityModel.Article,
      message: '',
      list: [],
      roles: [],
      users: [],
      hasAttachment: false,
    },
    resolver: yupResolver(mailingFormSchema),
  });

  const renderSelect = (): JSX.Element | null => {
    switch (watch('target')) {
      case MailingTarget.Role:
        return (
          <SelectComponent
            id="role-select"
            name="roles"
            options={userRolesOptions}
            formControl={control}
            multipleChoice
            placeholder="Выберите специальности"
            color={watch('severety')}
          />
        );
      case MailingTarget.User:
        return (
          <SelectComponent
            autocomplete
            multipleChoice
            fullWidth
            formControl={control}
            name="users"
            id="users"
            placeholder="Выберите сотрудника(ов)"
            options={adminStore.users
              .map(user => ({
                title: getFio(user),
                id: user.uid,
              }))
              .sort((a, b) => -b.title[0].localeCompare(a.title[0]))}
            group={option => option.title[0]}
            color={watch('severety')}
          />
        );
      default:
        return null;
    }
  };

  const renderAttachmentBlock = (): JSX.Element => (
    <>
      <Grid item xs={12}>
        <CenteredContentBox>
          <Typography variant="caption">Выберите тип вложения</Typography>
          <RadioButtonGroup
            horizontal
            options={attachmentEntityOptions}
            formControl={control}
            error={!!errors.entity}
            errorMessage={errors.entity && errors.entity.message}
            name="entity"
            color={watch('severety')}
          />
        </CenteredContentBox>
      </Grid>
      <Grid item xs={12}>
        <SelectComponent
          autocomplete
          multipleChoice
          fullWidth
          placeholder="Выберите статью"
          formControl={control}
          name="list"
          id="list"
          color={watch('severety')}
          options={adminStore.articles
            .map(item => ({
              title: item.title,
              id: item.id,
            }))
            .sort((a, b) => -b.title[0].localeCompare(a.title[0]))}
          group={option => option.title[0]}
        />
      </Grid>
    </>
  );

  const onSubmit = (data: MailingFormModel): void => {
    setNotificationSending(true);

    const mailingList = getMailingList(data, adminStore);

    if (!mailingList.length) {
      setSnackbarState(prev => ({
        ...prev,
        message: 'Нет адресатов рассылки',
        alert: 'error',
        isOpen: true,
      }));
      setNotificationSending(false);
      return;
    }

    const obj: NotificationModel = getNotificationObject(data);

    Promise.all(
      mailingList.map(
        user =>
          new Promise((resolve, reject) => {
            adminStore
              .sendNotification(obj, user.uid)
              .then(value => {
                resolve(value);
              })
              .catch(err => reject(err));
          }),
      ),
    )
      .then(() => {
        reset();
        setNotificationSending(false);
        setSnackbarState(prev => ({
          ...prev,
          message: 'Рассылка отправлена',
          alert: 'success',
          isOpen: true,
        }));
      })
      .catch(err => {
        console.error(err);
        setNotificationSending(false);
        setSnackbarState(prev => ({
          ...prev,
          message: 'Произошла ошибка. Повторите позже',
          alert: 'error',
          isOpen: true,
        }));
      });
  };

  return (
    <Main>
      <PageTitle>Рассылка пользователям</PageTitle>
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12}>
          <CenteredContentBox>
            <Typography variant="caption">Выберите тип рассылки</Typography>
            <RadioButtonGroup
              horizontal
              formControl={control}
              name="target"
              options={mailTargetOptions}
              color={watch('severety')}
            />
          </CenteredContentBox>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <CenteredContentBox>
              <Typography variant="caption">Выберите важность</Typography>
              <RadioButtonGroup
                horizontal
                options={severetyOptions}
                formControl={control}
                error={!!errors.severety}
                errorMessage={errors.severety && errors.severety.message}
                name="severety"
                color={watch('severety')}
              />
            </CenteredContentBox>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {renderSelect()}
        </Grid>
        <Grid item xs={12}>
          <InputComponent
            type={InputType.Text}
            placeholder="Введите сообщение"
            multiline
            name="message"
            formControl={control}
            error={!!errors.message}
            errorMessage={errors.message && errors.message.message}
            color={watch('severety')}
          />
        </Grid>
        {watch('hasAttachment') ? renderAttachmentBlock() : null}
        <Grid sx={{ display: 'flex', justifyContent: 'center' }} item xs={12}>
          <CenteredContentBox>
            <CheckboxComponent
              name="hasAttachment"
              formControl={control}
              label="С вложением"
              color={watch('severety')}
            />
            <LoadingButton
              color={getButtonSeveretyColor(watch('severety'))}
              loadingPosition="start"
              loading={notificationSending}
              startIcon={<SendIcon />}
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Отправить
            </LoadingButton>
          </CenteredContentBox>
        </Grid>
      </Grid>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </Main>
  );
};

export default AdminMailingPage;
