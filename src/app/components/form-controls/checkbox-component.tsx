import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

interface Props {
  error?: boolean;
  errorMessage?: string;
  formControl: any;
  name: string;
  label?: string;
  color?: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';
}

export const CheckboxComponent = (props: Props): JSX.Element => {
  const { formControl, name, color = 'primary', label } = props;

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={formControl}
          render={({ field }) => (
            <Checkbox
              color={color}
              {...field}
              checked={field.value}
              onChange={e => field.onChange(e.target.checked)}
            />
          )}
        />
      }
      label={label}
    />
  );
};
