import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { OpenState } from 'app/constants/open-state';
import { Routes } from 'app/routes/routes';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

interface Props {
  open: OpenState;
  handleClose: () => void;
  resetFunc: () => void;
  goBack?: string;
}

const SaveArticleDialog = (props: Props): JSX.Element => {
  const { open, goBack, handleClose, resetFunc } = props;

  const history = useHistory();

  return (
    <Dialog
      open={open === OpenState.Opened}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h5" component="p">
          Статья сохранена
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Что дальше?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mb: 2, px: 2 }}>
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
      </DialogActions>
    </Dialog>
  );
};

export default SaveArticleDialog;
