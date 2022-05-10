import { AutocompleteOption } from 'app/constants/autocomplete-option';
import {
  NotificationAttachmentLink,
  NotificationModel,
} from 'app/constants/notification-model';
import { Routes } from 'app/routes/routes';
import { Timestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { generatePath } from 'react-router-dom';
import { MailingFormModel } from './mailing-form-model';

export const getNotificationObject = (
  data: MailingFormModel,
): NotificationModel => {
  let linksList: NotificationAttachmentLink[] = [];

  if (data.list) {
    linksList = data.list.map(item => ({
      title: (item as unknown as AutocompleteOption).title,
      link: generatePath(Routes.SINGLE_ARTICLE, {
        articleId: (item as unknown as AutocompleteOption).id,
      }),
    }));
  }

  return {
    id: nanoid(),
    severety: data.severety,
    message: data.message,
    attachment: data.hasAttachment
      ? { entity: data.entity!, links: linksList }
      : null,
    sentDate: Timestamp.now(),
    read: false,
  };
};
