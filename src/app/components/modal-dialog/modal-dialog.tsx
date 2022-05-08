import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  children: JSX.Element | JSX.Element[];
  actions?: JSX.Element | JSX.Element[];
  title: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg';
  closeText?: string;
}

export const ModalDialog = (props: Props): JSX.Element => {
  const {
    isOpen,
    handleClose,
    children,
    actions,
    title,
    maxWidth,
    closeText,
    subtitle,
  } = props;

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="p">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="caption">{subtitle}</Typography>
        ) : null}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions ?? <Button onClick={handleClose}>{closeText}</Button>}
      </DialogActions>
    </Dialog>
  );
};

ModalDialog.defaultProps = {
  closeText: 'Отмена',
  maxWidth: 'sm',
};
