import { TextField } from '@mui/material';
import { InputType } from 'app/constants/input-type';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface Props {
  type: InputType;
  error?: boolean;
  errorMessage?: string;
  formControl: any;
  name: string;
  variant?: 'outlined' | 'standard' | 'filled';
  placeholder?: string;
  multiline?: boolean;
  small?: boolean;
  styles?: React.CSSProperties;
  onBlurAction?: () => void;
  color?: string;
}

export const InputComponent = (props: Props): JSX.Element => {
  const {
    type,
    error,
    errorMessage,
    formControl,
    name,
    variant,
    placeholder,
    multiline,
    small,
    styles,
    onBlurAction,
    color,
  } = props;

  const [severetyColor, setSeveretyColor] = useState<
    | 'error'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | undefined
  >('primary');

  useEffect(() => {
    switch (color) {
      case 'error':
        setSeveretyColor('error');
        break;
      case 'secondary':
        setSeveretyColor('secondary');
        break;
      case 'success':
        setSeveretyColor('success');
        break;
      case 'info':
        setSeveretyColor('info');
        break;
      case 'warning':
        setSeveretyColor('warning');
        break;
      default:
        setSeveretyColor('primary');
    }
  }, [color]);

  return (
    <Controller
      control={formControl}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          sx={styles}
          size={small ? 'small' : undefined}
          multiline={multiline}
          error={!!error}
          helperText={errorMessage}
          label={placeholder}
          fullWidth
          variant={variant}
          type={type}
          onBlur={onBlurAction}
          color={severetyColor}
        />
      )}
    />
  );
};

InputComponent.defaultProps = {
  variant: 'outlined',
  small: false,
};
