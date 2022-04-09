import { Gender } from './gender';
import { UserRole } from './user-roles';

export interface UserModel {
  isSuperAdmin?: boolean;
  uid: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: UserRole;
  birthDate?: Date;
  gender?: Gender;
  readArticles?: string[];
}
