import { Category } from './category-model';
import { UserRole } from './user-roles';

export interface ReadMoreItem {
  title: string;
  id: string;
}

export interface ArticleModel {
  id: string;
  title: string;
  description?: string;
  delta: any;
  roles: UserRole[];
  categories: Category[];
  created?: Date;
  readMore?: ReadMoreItem[];
}
