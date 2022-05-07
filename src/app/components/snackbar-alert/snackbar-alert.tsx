import { Alert, AlertColor, Snackbar } from '@mui/material';
import { OpenState } from 'app/constants/open-state';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import React from 'react';

export interface Props {
  isOpen: boolean;
  message: string;
  alert: AlertColor | undefined;
  setState: React.Dispatch<React.SetStateAction<SnackBarStateProps>>;
}

export const SnackbarAlert = (props: Props): JSX.Element => {
  const { isOpen, message, alert, setState } = props;

  const handleSnackBarClose = (): void => {
    setState(prev => ({
      ...prev,
      openState: OpenState.Closed,
    }));
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleSnackBarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={handleSnackBarClose}
        severity={alert}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
