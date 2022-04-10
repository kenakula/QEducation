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
import React from 'react';

interface Props {
  open: OpenState;
  handleClose: () => void;
  handleAgree: () => void;
  title: string;
  message: string;
}

const ConfirmDialog = (props: Props): JSX.Element => {
  const { open, handleClose, title, message, handleAgree } = props;

  const handleAgreeBtn = (): void => {
    handleAgree();
    handleClose();
  };

  return (
    <Dialog
      open={open === OpenState.Opened}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h5" component="p">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mb: 2, px: 2 }}>
        <Button color="error" variant="outlined" onClick={handleClose}>
          Отменить
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleAgreeBtn();
            handleClose();
          }}
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
