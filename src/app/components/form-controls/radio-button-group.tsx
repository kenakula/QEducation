import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { RadioButtonGroupOption } from 'app/constants/radio-button-group-option';
import React from 'react';
import { Controller } from 'react-hook-form';

interface Props {
  error?: boolean;
  errorMessage?: string;
  formControl: any;
  name: string;
  label?: string;
  styles?: React.CSSProperties;
  options: RadioButtonGroupOption[];
  horizontal?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export const RadioButtonGroup = (props: Props): JSX.Element => {
  const {
    error,
    errorMessage,
    formControl,
    name,
    label,
    styles,
    options,
    horizontal,
    color = 'primary',
  } = props;

  return (
    <FormControl component="fieldset" sx={styles ?? undefined} error={!!error}>
      {label ? <FormLabel color={color}>{label}</FormLabel> : null}
      <Controller
        control={formControl}
        name={name}
        render={({ field }) => (
          <RadioGroup {...field} row={horizontal}>
            {options.map(item => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                label={item.label}
                control={<Radio color={color} />}
                disabled={item.disabled}
              />
            ))}
          </RadioGroup>
        )}
      />
      {errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null}
    </FormControl>
  );
};
