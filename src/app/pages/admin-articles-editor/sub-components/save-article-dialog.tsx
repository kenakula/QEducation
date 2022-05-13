import { Button, DialogContentText } from '@mui/material';
import { ModalDialog } from 'app/components/modal-dialog';
import { Routes } from 'app/routes/routes';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

interface Props {
  open: boolean;
  handleClose: () => void;
  resetFunc: () => void;
  goBack?: string;
}

const SaveArticleDialog = (props: Props): JSX.Element => {
  const { open, goBack, handleClose, resetFunc } = props;

  const ModalActions = React.memo((): JSX.Element => {
    const history = useHistory();

    return (
      <>
        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            handleClose();
            resetFunc();
          }}
        >
          Очистить и продолжить
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            resetFunc();
            history.push(Routes.ADMIN_ARTICLES);
            handleClose();
          }}
          autoFocus
        >
          К статьям
        </Button>
        {goBack && (
          <Button
            variant="outlined"
            component={Link}
            sx={{ ml: 1 }}
            to={goBack}
            onClick={() => {
              resetFunc();
              handleClose();
            }}
          >
            К категории
          </Button>
        )}
      </>
    );
  });

  return (
    <ModalDialog
      isOpen={open}
      handleClose={handleClose}
      title="Статья сохранена"
      actions={<ModalActions />}
    >
      <DialogContentText>Что дальше?</DialogContentText>
    </ModalDialog>
  );
};

export default SaveArticleDialog;
