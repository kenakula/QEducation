import { IconButton, DialogTitle } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

const DialogTitleContainer = (props: DialogTitleProps): JSX.Element => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default DialogTitleContainer;
