import { TabsItem } from 'app/constants/tabs-model';
import { UserRole } from 'app/constants/user-roles';

// eslint-disable-next-line no-shadow
export enum PageContentType {
  Categories = 'categories',
  Checklists = 'checklists',
  Vebinars = 'vebinars',
  Scripts = 'scripts',
}

export const roleTabs: TabsItem<UserRole>[] = [
  {
    value: UserRole.Doctor,
    label: 'Врачи',
  },
  {
    value: UserRole.Administrator,
    label: 'Администраторы',
  },
  {
    value: UserRole.Nurse,
    label: 'Медсёстры',
  },
];

export const contentTabs: TabsItem<PageContentType>[] = [
  {
    value: PageContentType.Categories,
    label: 'Статьи',
  },
  {
    value: PageContentType.Vebinars,
    label: 'Вебинары',
  },
  {
    value: PageContentType.Checklists,
    label: 'Чеклисты',
  },
  {
    value: PageContentType.Scripts,
    label: 'Скрипты',
  },
];
