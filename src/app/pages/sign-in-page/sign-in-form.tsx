import * as yup from 'yup';

export const signInSchema = yup.object({
  email: yup
    .string()
    .email('Почта введена неправильно')
    .required('Это обязательное поле'),
  password: yup
    .string()
    .min(4, 'Введите не менее 6 символов')
    .required('Это обязательное поле'),
});
