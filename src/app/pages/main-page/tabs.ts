import { TabsItem } from 'app/constants/tabs-model';
import { UserRole } from 'app/constants/user-roles';
import { PageContentType } from 'app/stores/main-page-store/main-page-store';

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
];