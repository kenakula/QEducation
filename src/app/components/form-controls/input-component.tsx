import { TextField } from '@mui/material';
import { InputType } from 'app/constants/input-type';
import React from 'react';
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
  color?: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';
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
    color = 'primary',
  } = props;

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
          color={color}
        />
      )}
    />
  );
};

InputComponent.defaultProps = {
  variant: 'outlined',
  small: false,
};
