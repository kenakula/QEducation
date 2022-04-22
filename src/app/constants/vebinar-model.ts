import { Timestamp } from 'firebase/firestore';
import { UserRole } from './user-roles';

export interface VebinarModel {
  id: string;
  title: string;
  description?: string;
  roles: UserRole[];
  link: string;
  createdDate: Timestamp;
}
