import { UserRole } from './user-roles';

export interface SignUpModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
