import { Button, DialogContentText } from '@mui/material';
import React from 'react';
import { ModalDialog } from './modal-dialog';

export interface ModalDialogConfirmStateProps {
  id: string;
  isOpen: boolean;
}

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleAgree: () => void;
  title?: string;
  message?: string;
}

export const ModalDialogConfirm = (props: Props): JSX.Element => {
  const { isOpen, handleClose, title, message, handleAgree } = props;

  const handleAgreeBtn = (): void => {
    handleAgree();
    handleClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      handleClose={handleClose}
      title={title ?? 'Вы уверены, что хотите удалить?'}
      actions={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Отменить
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              handleAgreeBtn();
              handleClose();
            }}
            autoFocus
          >
            OK
          </Button>
        </>
      }
    >
      <DialogContentText>{message}</DialogContentText>
    </ModalDialog>
  );
};

ModalDialogConfirm.defaultProps = {
  message: 'Действие необратимо',
};
