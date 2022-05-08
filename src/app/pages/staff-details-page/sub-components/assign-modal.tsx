/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  NotificationAttachmentEntity,
  NotificationAttachmentLink,
  NotificationModel,
  NotificationSeverety,
} from 'app/constants/notification-model';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ModalDialog } from 'app/components/modal-dialog';
import { RadioButtonGroupOption } from 'app/constants/radio-button-group-option';
import { Button, Grid } from '@mui/material';
import { RadioButtonGroup } from 'app/components/form-controls/radio-button-group';
import { InputComponent, SelectComponent } from 'app/components/form-controls';
import { InputType } from 'app/constants/input-type';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import {
  ASSIGN_ARTICLE_TEXT,
  ASSIGN_CHECKLIST_TEXT,
  ASSIGN_SCRIPT_TEXT,
  ASSIGN_TEST_TEXT,
} from '../assets';
import { nanoid } from 'nanoid';
import { Timestamp } from 'firebase/firestore';
import { generatePath } from 'react-router-dom';
import { Routes } from 'app/routes/routes';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';

const entityOptions: RadioButtonGroupOption[] = [
  {
    value: NotificationAttachmentEntity.Article,
    label: 'Статья',
  },
  {
    value: NotificationAttachmentEntity.Test,
    label: 'Тест',
    disabled: true,
  },
  {
    value: NotificationAttachmentEntity.Checklist,
    label: 'Чеклист',
    disabled: true,
  },
  {
    value: NotificationAttachmentEntity.Script,
    label: 'Скрипты',
    disabled: true,
  },
];

const severetyOptions: RadioButtonGroupOption[] = [
  {
    value: 'primary',
    label: 'Обычная',
  },
  {
    value: 'info',
    label: 'Информационная',
  },
  {
    value: 'warning',
    label: 'Предупредительная',
  },
  {
    value: 'error',
    label: 'Суперважная',
  },
];

interface AutocompleteOption {
  id: string;
  title: string;
}

export interface AssignFormModel {
  entity: NotificationAttachmentEntity;
  list: string[];
  message: string;
  severety: string;
}

const assignFormSchema = yup.object({
  entity: yup.string().required('Это поле обязательное'),
  list: yup.array().min(1),
  message: yup.string().required('Это поле обязательное'),
  severety: yup.string().required('Это поле обязательное'),
});

interface Props {
  userId: string;
  isOpen: boolean;
  handleClose: () => void;
}

export const AssignModal = (props: Props): JSX.Element => {
  const { userId, isOpen, handleClose } = props;

  const adminStore = useAdminStore();

  const [notificationSending, setNotificationSending] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Статья назначена. Уведомление отправлено',
    alert: 'success',
  });

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<AssignFormModel>({
    defaultValues: {
      entity: NotificationAttachmentEntity.Article,
      list: [],
      message: '',
      severety: 'primary',
    },
    resolver: yupResolver(assignFormSchema),
  });

  const setMessage = (entity: NotificationAttachmentEntity): void => {
    switch (entity) {
      case NotificationAttachmentEntity.Test:
        setValue('message', ASSIGN_TEST_TEXT);
        break;
      case NotificationAttachmentEntity.Checklist:
        setValue('message', ASSIGN_CHECKLIST_TEXT);
        break;
      case NotificationAttachmentEntity.Script:
        setValue('message', ASSIGN_SCRIPT_TEXT);
        break;
      default:
        setValue('message', ASSIGN_ARTICLE_TEXT);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMessage(watch('entity'));
    }
  }, [isOpen]);

  useEffect(() => {
    const value = watch('entity');
    setMessage(value);
  }, [watch('entity')]);

  const getSeveretyColor = ():
    | 'primary'
    | 'inherit'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning' => {
    const severety = watch('severety');

    switch (severety) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  const generateNotification = (data: AssignFormModel): NotificationModel => {
    const list: NotificationAttachmentLink[] = data.list.map(item => ({
      title: (item as unknown as AutocompleteOption).title,
      link: generatePath(Routes.ARTICLE_PAGE, {
        articleId: (item as unknown as AutocompleteOption).id,
      }),
    }));

    return {
      id: nanoid(),
      severety: data.severety as NotificationSeverety,
      message: data.message,
      read: false,
      attachment: {
        entity: data.entity,
        links: list,
      },
      sentDate: Timestamp.now(),
    };
  };

  const onSubmit = (data: AssignFormModel): void => {
    const obj = generateNotification(data);
    setNotificationSending(true);

    adminStore.sendNotification(obj, userId).then(() => {
      setSnackbarState(prev => ({
        ...prev,
        isOpen: true,
      }));
      setNotificationSending(false);
      reset();
    });
  };

  return (
    <ModalDialog
      handleClose={handleClose}
      isOpen={isOpen}
      title="Выберите назначение"
      subtitle="Создайте уведомление для пользователя, в нем он получит ссылки на прикрепленные материалы"
      maxWidth="md"
    >
      <Grid
        spacing={2}
        container
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid xs={12} sx={{ display: 'flex' }} justifyContent="center" item>
          <RadioButtonGroup
            horizontal
            options={entityOptions}
            formControl={control}
            error={!!errors.entity}
            errorMessage={errors.entity && errors.entity.message}
            name="entity"
          />
        </Grid>
        <Grid
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            '& .MuiTextField-root': { flexDirection: 'row' },
          }}
          justifyContent="center"
          item
        >
          <InputComponent
            type={InputType.Text}
            placeholder="Введите сообщение"
            multiline
            name="message"
            formControl={control}
            error={!!errors.message}
            errorMessage={errors.message && errors.message.message}
          />
        </Grid>
        <Grid
          xs={12}
          sm={6}
          sx={{ display: 'flex' }}
          justifyContent="center"
          item
        >
          <RadioButtonGroup
            label="Выберите важность"
            options={severetyOptions}
            formControl={control}
            error={!!errors.severety}
            errorMessage={errors.severety && errors.severety.message}
            name="severety"
          />
        </Grid>
        <Grid xs={12} sx={{ display: 'flex' }} justifyContent="center" item>
          <SelectComponent
            small
            autocomplete
            multipleChoice
            fullWidth
            formControl={control}
            name="list"
            id="list"
            options={adminStore.articles
              .map(item => ({
                title: item.title,
                id: item.id,
              }))
              .sort((a, b) => -b.title[0].localeCompare(a.title[0]))}
            group={option => option.title[0]}
          />
        </Grid>
        <Grid xs={12} sx={{ display: 'flex' }} justifyContent="center" item>
          <Button
            disabled={notificationSending}
            color={getSeveretyColor()}
            type="submit"
            variant="contained"
          >
            Отправить
          </Button>
        </Grid>
      </Grid>
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </ModalDialog>
  );
};
