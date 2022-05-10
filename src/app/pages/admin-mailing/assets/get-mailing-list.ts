import { AutocompleteOption } from 'app/constants/autocomplete-option';
import { UserModel } from 'app/constants/user-model';
import { AdminStore } from 'app/stores/admin-store/admin-store';
import { MailingFormModel, MailingTarget } from './mailing-form-model';

export const getMailingList = (
  data: MailingFormModel,
  store: AdminStore,
): UserModel[] =>
  store.users.filter(user => {
    switch (data.target) {
      case MailingTarget.Role:
        return data.roles?.includes(user.role);
      case MailingTarget.User:
        return data.users?.some(
          value => (value as unknown as AutocompleteOption).id === user.uid,
        );
      default:
        return true;
    }
  });
