import { Timestamp } from 'firebase/firestore';
import { RadioButtonGroupOption } from './radio-button-group-option';

/* eslint-disable no-shadow */
export enum EntityModel {
  Article = 'article',
  Test = 'test',
  Checklist = 'checklist',
  Script = 'script',
}

export interface NotificationAttachmentItem {
  title: string;
  link: string;
  attachmentId: string;
}

export interface NotificationAttachment {
  entity: EntityModel;
  links: NotificationAttachmentItem[];
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
    value: EntityModel.Article,
    label: 'Статья',
  },
  {
    value: EntityModel.Test,
    label: 'Тест',
    disabled: true,
  },
  {
    value: EntityModel.Checklist,
    label: 'Чеклист',
    disabled: true,
  },
  {
    value: EntityModel.Script,
    label: 'Скрипты',
    disabled: true,
  },
];
