import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useState } from 'react';
import { escapeRegExp } from 'app/utils/text-helpers';

export interface IToolbarFields {
  type: 'search' | 'select' | 'custom';
  gloabalSearch?: boolean;
  fieldName: string;
  options?: any[];
  component?: JSX.Element;
  label: string;
}

interface Props {
  fields: IToolbarFields[];
  arraySetter: React.Dispatch<React.SetStateAction<any[]>>;
  originalRowsData: any[];
  filterParamsModel: any;
}

export const CustomToolbar = (props: Props): JSX.Element => {
  const { fields, arraySetter, originalRowsData, filterParamsModel } = props;
  const [searchText, setSearchText] = useState('');
  const [filterParams, setFilterParams] = useState(filterParamsModel);

  useEffect(() => {
    setFilterParams(filterParamsModel);
  }, [filterParamsModel]);

  useEffect(() => {
    const filterData = (list: any[], params: any): any[] => {
      const paramsKeys = Object.keys(params);
      let result = list;

      paramsKeys.forEach((key: string) => {
        if (Array.isArray(filterParams[key])) {
          if (filterParams[key].length) {
            result = result.filter(val =>
              filterParams[key].some((item: any) => val[key].includes(item)),
            );
          }
        } else {
          result = result.filter(val => {
            if (val[key]) {
              return val[key].toLowerCase().includes(filterParams[key]);
            }

            if (!val[key] && val.uid) {
              // строка пользователя без данных
              return true;
            }

            return null;
          });
        }
      });

      return result;
    };

    if (originalRowsData.length) {
      const filtered = filterData(originalRowsData, filterParams);
      arraySetter(filtered);
    } else {
      arraySetter(originalRowsData);
    }
  }, [filterParams, originalRowsData, arraySetter]);

  const handleSearch = (
    evt: React.ChangeEvent<HTMLInputElement>,
    field: IToolbarFields,
  ): void => {
    const value = evt.target.value.toLowerCase();

    setFilterParams((prev: any) => ({
      ...prev,
      [field.fieldName]: value,
    }));
  };

  const handleSelect = (
    evt: SelectChangeEvent<any>,
    field: IToolbarFields,
  ): void => {
    const value = evt.target.value;

    setFilterParams((prev: any) => ({
      ...prev,
      [field.fieldName]: value,
    }));
  };

  const requestSearch = (searchValue: string): void => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = originalRowsData.filter((row: any) =>
      Object.keys(row).some((field: any) =>
        searchRegex.test(row[field].toString()),
      ),
    );
    arraySetter(filteredRows);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat( auto-fit, minmax(250px, 1fr) )',
        gap: '10px',
      }}
    >
      {fields &&
        fields.map((field: IToolbarFields) => {
          switch (field.type) {
            case 'search':
              return (
                <TextField
                  size="small"
                  key={field.fieldName}
                  variant="outlined"
                  value={
                    field.gloabalSearch
                      ? searchText
                      : filterParams[field.fieldName]
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.gloabalSearch
                      ? requestSearch(e.target.value)
                      : handleSearch(e, field)
                  }
                  placeholder={field.label}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        title="Стереть"
                        aria-label="Стереть"
                        style={{
                          visibility: filterParams[field.fieldName]
                            ? 'visible'
                            : 'hidden',
                        }}
                        onClick={() =>
                          setFilterParams((prev: any) => ({
                            ...prev,
                            [filterParams[field.fieldName]]: '',
                          }))
                        }
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              );
            case 'select':
              return (
                <FormControl size="small" key={field.fieldName}>
                  <InputLabel id={`${field.fieldName}-filter`}>
                    {field.label}
                  </InputLabel>
                  <Select
                    labelId={`${field.fieldName}-filter`}
                    value={filterParams[field.fieldName]}
                    onChange={(e: SelectChangeEvent<any>) =>
                      handleSelect(e, field)
                    }
                    sx={{
                      minWidth: '200px',
                    }}
                    input={<OutlinedInput size="small" label={field.label} />}
                    renderValue={selected => selected.join(', ')}
                    multiple
                  >
                    {field.options && field.options.length ? (
                      field.options.map(item =>
                        item.value ? (
                          <MenuItem key={item.value} value={item.label}>
                            <Checkbox
                              checked={filterParams[field.fieldName].includes(
                                item.label,
                              )}
                            />
                            <ListItemText primary={item.label} />
                          </MenuItem>
                        ) : (
                          <MenuItem key={item} value={item}>
                            <Checkbox
                              checked={filterParams[field.fieldName].includes(
                                item,
                              )}
                            />
                            <ListItemText primary={item} />
                          </MenuItem>
                        ),
                      )
                    ) : (
                      <MenuItem>
                        <ListItemText primary="Нет категорий" />
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              );
            case 'custom':
              return <Box key={field.fieldName}>{field.component}</Box>;
            default:
              return null;
          }
        })}
    </Box>
  );
};
