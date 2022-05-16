import {
  EntityModel,
  NotificationSeverety,
} from 'app/constants/notification-model';
import { RadioButtonGroupOption } from 'app/constants/radio-button-group-option';

// eslint-disable-next-line no-shadow
export enum MailingTarget {
  All = 'all',
  Role = 'role',
  User = 'user',
}

export interface MailingFormModel {
  target: MailingTarget;
  message: string;
  severety: NotificationSeverety;
  entity?: EntityModel;
  roles?: string[];
  users?: string[];
  list?: string[];
  hasAttachment: boolean;
}

export const mailTargetOptions: RadioButtonGroupOption[] = [
  {
    value: MailingTarget.All,
    label: 'Всем',
  },
  {
    value: MailingTarget.Role,
    label: 'По специальности',
  },
  {
    value: MailingTarget.User,
    label: 'Выбрать вручную',
  },
];
