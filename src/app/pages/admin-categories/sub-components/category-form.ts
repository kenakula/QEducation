import * as yup from 'yup';

export const categoryFormModel = yup.object({
  title: yup.string().required('Это поле обязательное'),
  description: yup.string(),
});
