import { Timestamp } from 'firebase/firestore';

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
  | 'inherit'
  | 'disabled'
  | 'action'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | undefined;

export interface NotificationModel {
  id: string;
  severety: NotificationSeverety;
  message: string;
  read: boolean;
  attachment?: NotificationAttachment | null;
  sentDate: Timestamp;
}
