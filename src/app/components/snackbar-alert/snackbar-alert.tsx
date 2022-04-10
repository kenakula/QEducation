import { Alert, AlertColor, Snackbar } from '@mui/material';
import { OpenState } from 'app/constants/open-state';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import React from 'react';

export interface Props {
  openState: OpenState;
  message: string;
  alert: AlertColor | undefined;
  setState: React.Dispatch<React.SetStateAction<SnackBarStateProps>>;
}

const SnackbarAlert = (props: Props): JSX.Element => {
  const { openState, message, alert, setState } = props;

  const handleSnackBarClose = (): void => {
    setState(prev => ({
      ...prev,
      openState: OpenState.Closed,
    }));
  };

  return (
    <Snackbar
      open={openState === OpenState.Opened}
      autoHideDuration={4000}
      onClose={handleSnackBarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
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

export default SnackbarAlert;
