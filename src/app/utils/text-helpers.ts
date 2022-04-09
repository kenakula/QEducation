import { UserModel } from 'app/constants/user-model';
import { UserRole } from 'app/constants/user-roles';

export const getFio = (user: UserModel, short: boolean = true): string => {
  const shortV = `${user.lastName} ${user.firstName[0]}.${
    user.middleName ? `${user.middleName[0]}.` : ''
  }`;

  return short
    ? shortV
    : `${user.lastName} ${user.firstName} ${
        user.middleName ? user.middleName : ''
      }`;
};

export const getShortRoleText = (role: string): string => {
  switch (role) {
    case 'Администратор':
      return 'Адм';
    case 'Медсестра':
      return 'Медс';
    default:
      return 'Врач';
  }
};

export const mapTextToRole = (text: string): UserRole => {
  switch (text) {
    case 'Администратор':
      return UserRole.Administrator;
    case 'Медсестра':
      return UserRole.Nurse;
    default:
      return UserRole.Doctor;
  }
};

export const escapeRegExp = (value: string): string =>
  value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
