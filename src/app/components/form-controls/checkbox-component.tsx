import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface Props {
  error?: boolean;
  errorMessage?: string;
  formControl: any;
  name: string;
  color?: string;
  label?: string;
}
// TODO errors
export const CheckboxComponent = (props: Props): JSX.Element => {
  const { formControl, name, color, label } = props;

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
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={formControl}
          render={({ field }) => (
            <Checkbox
              color={severetyColor}
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
