import { SelectOption } from './select-option';

/* eslint-disable no-shadow */
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export const genderOptions: SelectOption[] = [
  {
    label: 'Мужчина',
    value: Gender.Male,
  },
  {
    label: 'Женщина',
    value: Gender.Female,
  },
  {
    label: 'Другое',
    value: Gender.Other,
  },
];
