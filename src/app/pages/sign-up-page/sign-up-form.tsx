import * as yup from 'yup';

export const signUpSchema = yup.object({
  firstName: yup.string().required('Это обязательное поле'),
  lastName: yup.string().required('Это обязательное поле'),
  email: yup
    .string()
    .email('Почта введена неправильно')
    .required('Это обязательное поле'),
  role: yup.string().required('Это обязательное поле'),
  password: yup
    .string()
    .min(6, 'Введите не менее 6 символов')
    .required('Это обязательное поле'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Это обязательное поле'),
});
