/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import { InputComponent, SelectComponent } from 'app/components/form-controls';
import { ModalDialog } from 'app/components/modal-dialog';
import { InputType } from 'app/constants/input-type';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { FileInput } from 'app/pages/profile-page/sub-components/styled-elements';
import { StorageFolder } from 'app/constants/storage-folder';
import {
  NextObserverType,
  useFirebaseContext,
} from 'app/stores/firebase-store/firebase-store';
import { UploadTaskSnapshot } from 'firebase/storage';

const MAX_FILE_SIZE = 10e6;

const uploadSchema = yup.object({
  folder: yup.string().required('Все файлы должны лежать в папках'),
  name: yup.string().required('Поле обязательное'),
  file: yup.mixed().required('Выберите файл'),
});

interface UploadFormModel {
  folder: string;
  name: string;
  file: File | null;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSuccess: (cb?: () => void) => void;
  handleError: (cb?: () => void) => void;
}

export const DocumentUploadDialog = observer((props: Props): JSX.Element => {
  const { open, handleClose, handleSuccess, handleError } = props;
  const store = useMainPageStore();
  const firebase = useFirebaseContext();

  const [fileUploading, setFileUploading] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<UploadFormModel>({
    defaultValues: {
      folder: '',
      name: '',
      file: null,
    },
    resolver: yupResolver(uploadSchema),
  });

  const onInputFileSelect = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedFiles = evt.target.files;

    const file =
      selectedFiles && selectedFiles.length ? selectedFiles[0] : null;

    if (!file) {
      return;
    }

    if (file.size >= MAX_FILE_SIZE) {
      setError('file', {
        message: 'Файл слишком большой, загрузите файл не более 10 мБ',
      });

      return;
    }

    clearErrors('file');
    setValue('file', file);
    setValue('name', file.name);
  };

  const uploadObserver: NextObserverType = (snapshot: UploadTaskSnapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFileProgress(progress);
  };

  const onSubmit = (data: UploadFormModel): void => {
    const extension = data.file?.name.split('.').pop();
    const path = `${StorageFolder.Documents}/${data.folder}/${data.name}.${extension}`;

    if (!data.file) return;

    setFileUploading(true);
    const cb = (): void => setFileUploading(false);

    firebase.uploadFileWithProgress(
      path,
      data.file,
      uploadObserver,
      () => {
        handleError(cb);
      },
      () => {
        handleSuccess(cb);
      },
    );
  };

  const ModalActions = (): JSX.Element => (
    <>
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        color="primary"
        disabled={fileUploading}
      >
        Загрузить
      </Button>
      <Button
        onClick={() => {
          reset();
          handleClose();
        }}
      >
        Отмена
      </Button>
    </>
  );

  return (
    <ModalDialog
      isOpen={open}
      title="Загрузите файл"
      subtitle="Выберите папку и имя файла"
      handleClose={() => {
        reset();
        handleClose();
      }}
      actions={<ModalActions />}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ pt: 2, position: 'relative' }}
      >
        <Box sx={{ mb: 2 }}>
          {store.documents.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <SelectComponent
                name="folder"
                formControl={control}
                error={!!errors.folder}
                errorMessage={errors.folder && errors.folder.message}
                id="folder-select"
                placeholder="Выберите папку из имеющихся"
                options={store.documents.map(folder => ({
                  label: folder.name,
                  value: folder.name,
                }))}
              />
              <Typography variant="caption" textAlign="center">
                или
              </Typography>
            </Box>
          ) : null}
          <InputComponent
            type={InputType.Text}
            name="folder"
            formControl={control}
            error={!!errors.folder}
            errorMessage={errors.folder && errors.folder.message}
            placeholder="Введите имя папки"
          />
        </Box>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Tooltip title="Выберите файл" placement="right">
            <label htmlFor="file-upload">
              <FileInput
                accept="*"
                id="file-upload"
                type="file"
                onChange={onInputFileSelect}
              />
              <IconButton component="span" size="large" sx={{ mr: 2 }}>
                <AttachFileIcon fontSize="large" />
              </IconButton>
            </label>
          </Tooltip>
          <InputComponent
            type={InputType.Text}
            name="name"
            formControl={control}
            placeholder="Введите имя файла"
            error={!!errors.name}
            errorMessage={errors.name && errors.name.message}
          />
        </Box>
        {!!errors.file && (
          <Typography
            variant="caption"
            color="error"
            sx={{ width: '100%', display: 'block' }}
          >
            {errors.file.message}
          </Typography>
        )}

        {fileUploading ? (
          <LinearProgress
            sx={{
              position: 'absolute',
              bottom: '-20px',
              left: 0,
              width: '100%',
            }}
            variant="determinate"
            value={fileProgress}
          />
        ) : null}
      </Box>
    </ModalDialog>
  );
});
