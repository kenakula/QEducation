import { Timestamp } from 'firebase/firestore';
import { RadioButtonGroupOption } from './radio-button-group-option';

/* eslint-disable no-shadow */
export enum NotificationAttachmentEntity {
  Article = 'article',
  Test = 'test',
  Checklist = 'checklist',
  Script = 'script',
}

export interface NotificationAttachmentLink {
  title: string;
  link: string;
}

export interface NotificationAttachment {
  entity: NotificationAttachmentEntity;
  links: NotificationAttachmentLink[];
}

export type NotificationSeverety =
  | 'error'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning';

export interface NotificationModel {
  id: string;
  severety: NotificationSeverety;
  message: string;
  read: boolean;
  attachment?: NotificationAttachment | null;
  sentDate: Timestamp;
}

export const attachmentEntityOptions: RadioButtonGroupOption[] = [
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
