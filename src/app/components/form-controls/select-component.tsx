import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { SelectOption } from 'app/constants/select-option';
import React, { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

interface Props {
  id: string;
  error?: boolean;
  errorMessage?: string | false | undefined;
  formControl: Control<any, any>;
  name: string;
  variant?: 'outlined' | 'standard' | 'filled';
  placeholder?: string;
  multipleChoice?: boolean;
  options: SelectOption[] | any[];
  styles?: React.CSSProperties;
  onBlurAction?: () => void;
  valueRenderer?: (value: any[]) => React.ReactNode;
  autocomplete?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  small?: boolean;
  group?: (option: any) => string;
  color?: string;
}

export const SelectComponent = (props: Props): JSX.Element => {
  const {
    id,
    error,
    errorMessage,
    formControl,
    autocomplete,
    name,
    variant,
    placeholder,
    multipleChoice,
    options,
    styles,
    disabled,
    onBlurAction,
    valueRenderer,
    small,
    group,
    color,
  } = props;

  // TODO вынести в отдельный файл
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

  if (autocomplete) {
    return (
      <Controller
        control={formControl}
        name={name}
        render={({ field }) => (
          <Autocomplete
            {...field}
            groupBy={group}
            disabled={disabled}
            multiple={multipleChoice}
            onChange={(event, item) => {
              field.onChange(item);
            }}
            options={options}
            fullWidth
            getOptionLabel={item => item.title}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField
                {...params}
                color={severetyColor}
                label={placeholder}
                variant={variant}
                size={small ? 'small' : undefined}
              />
            )}
            filterOptions={arr =>
              arr.filter(item => item.id !== formControl._formValues.id)
            }
            noOptionsText="Не найдено"
          />
        )}
      />
    );
  }

  return (
    <FormControl fullWidth size={small ? 'small' : undefined}>
      <InputLabel color={severetyColor} id={`${id}-label`} htmlFor={id}>
        {placeholder}
      </InputLabel>
      <Controller
        control={formControl}
        name={name}
        render={({ field }) => (
          <Select
            id={id}
            sx={styles}
            {...field}
            disabled={disabled}
            labelId={`${id}-label`}
            label={placeholder}
            variant={variant ?? 'outlined'}
            error={error}
            onBlur={onBlurAction}
            multiple={multipleChoice}
            renderValue={valueRenderer}
            color={severetyColor}
          >
            {options.map((option: SelectOption) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {error && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};
