import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { RadioButtonGroupOption } from 'app/constants/radio-button-group-option';
import React, { useEffect, useState } from 'react';
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
  color?: string;
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
    color,
  } = props;

  const [severetyColor, setSeveretyColor] = useState<
    | 'primary'
    | 'default'
    | 'error'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | undefined
  >('primary');
  const [labelSeveretyColor, setLabelSeveretyColor] = useState<
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined
  >('primary');

  useEffect(() => {
    switch (color) {
      case 'primary':
        setSeveretyColor('primary');
        setLabelSeveretyColor('primary');
        break;
      case 'error':
        setSeveretyColor('error');
        setLabelSeveretyColor('error');
        break;
      case 'secondary':
        setSeveretyColor('secondary');
        setLabelSeveretyColor('secondary');
        break;
      case 'success':
        setSeveretyColor('success');
        setLabelSeveretyColor('success');
        break;
      case 'info':
        setSeveretyColor('info');
        setLabelSeveretyColor('info');
        break;
      case 'warning':
        setSeveretyColor('warning');
        setLabelSeveretyColor('warning');
        break;
      default:
        setSeveretyColor('default');
    }
  }, [color]);

  return (
    <FormControl component="fieldset" sx={styles ?? undefined} error={!!error}>
      {label ? <FormLabel color={labelSeveretyColor}>{label}</FormLabel> : null}
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
                control={<Radio color={severetyColor} />}
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
