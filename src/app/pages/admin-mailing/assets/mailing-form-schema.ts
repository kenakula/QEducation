import * as yup from 'yup';

export const mailingFormSchema = yup.object({
  message: yup.string().required('Поле обязательное'),
  severety: yup.string().required('Поле обязательное'),
});
