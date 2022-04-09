import { AlertColor } from '@mui/material';
import { OpenState } from './open-state';

export interface SnackBarStateProps {
  openState: OpenState;
  message: string;
  alert: AlertColor | undefined;
}
