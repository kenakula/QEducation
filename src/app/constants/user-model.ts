import { Gender } from './gender';
import { EntityModel, NotificationAttachmentItem } from './notification-model';
import { UserRole } from './user-roles';

export interface UserModel {
  isSuperAdmin?: boolean;
  uid: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: UserRole;
  gender?: Gender;
  readArticles: string[];
}

export interface UserAssignment {
  entity: EntityModel;
  id: string;
  item: NotificationAttachmentItem;
}

export interface UserAssignmentsObject {
  articles: UserAssignment[];
  tests: UserAssignment[];
  checklists: UserAssignment[];
  scripts: UserAssignment[];
}
