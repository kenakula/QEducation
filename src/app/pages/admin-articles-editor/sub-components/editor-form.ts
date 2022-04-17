import * as yup from 'yup';

export const editorFormSchema = yup.object({
  id: yup.string().required(),
  title: yup.string().required('Введите заголовок'),
  description: yup.string(),
  roles: yup.array().min(1, 'Выберите специальности'),
  categories: yup.array().min(1, 'Выберите категории'),
  delta: yup.string().required('Наберите текст'),
  readMore: yup.array(),
});
