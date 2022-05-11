import { PageContentType } from 'app/constants/page-content-type';
import { TabsItem } from 'app/constants/tabs-model';
import { UserRole } from 'app/constants/user-roles';

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
    value: PageContentType.Documents,
    label: 'Документы',
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
