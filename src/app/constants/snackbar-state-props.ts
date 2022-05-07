import { AlertColor } from '@mui/material';

export interface SnackBarStateProps {
  isOpen: boolean;
  message: string;
  alert: AlertColor | undefined;
}
