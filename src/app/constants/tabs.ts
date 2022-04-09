import { UserRole } from './user-roles';

export interface TabModel {
  label: string;
  value: string;
  id: number;
  role?: UserRole;
  disabled?: boolean;
}

export const userTabs: TabModel[] = [
  {
    label: 'Статьи',
    value: 'articles',
    id: 1,
  },
  {
    label: 'Чек-листы',
    value: 'check-lists',
    id: 2,
  },
  {
    label: 'Вебинары',
    value: 'webinars',
    id: 3,
    disabled: true,
  },
  {
    label: 'Скрипты',
    value: 'scripts',
    id: 4,
    role: UserRole.Administrator,
  },
];
