import { Category } from './category-model';
import { SelectOption } from './select-option';

/* eslint-disable no-shadow */
export enum UserRole {
  Administrator = 'Администратор',
  Nurse = 'Медсестра',
  Doctor = 'Врач',
  None = '',
}

export const userRolesOptions: SelectOption[] = [
  {
    label: 'Администратор',
    value: UserRole.Administrator,
  },
  {
    label: 'Медсестра',
    value: UserRole.Nurse,
  },
  {
    label: 'Врач',
    value: UserRole.Doctor,
  },
];

export interface IRole {
  title: UserRole;
  categories: Category[];
}
