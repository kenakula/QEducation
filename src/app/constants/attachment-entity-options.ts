import { NotificationAttachmentEntity } from './notification-model';
import { RadioButtonGroupOption } from './radio-button-group-option';

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
