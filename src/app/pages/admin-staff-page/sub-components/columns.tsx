import { Box, Chip, styled, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

import { getFio, getShortRoleText } from 'app/utils/text-helpers';
import { GridColumn } from 'app/constants/table-constants';
import { UserRole } from 'app/constants/user-roles';

const CellElement = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
  '& .MuiChip-root': {
    marginRight: theme.spacing(1),
  },
}));

interface Props {
  matchTablet: boolean;
}

export const getColumns = (props: Props): GridColumn[] => {
  const { matchTablet } = props;

  return [
    {
      field: 'title',
      headerName: 'ФИО',
      width: 200,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => getFio(params.row, false),
      renderCell: (params: GridRenderCellParams<string>) => (
        <Tooltip title={params.value ?? ''}>
          <Typography>{params.value}</Typography>
        </Tooltip>
      ),
    },
    {
      field: 'role',
      headerName: 'Специальность',
      headerAlign: 'center',
      width: matchTablet ? 150 : 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      // mui выдает ошибку если не использовать valueGetter
      valueGetter: (params: GridValueGetterParams<UserRole>) => params.value,
      renderCell: (params: GridRenderCellParams<string>) => (
        <CellElement>
          <Chip
            key={params.value}
            size="small"
            variant="outlined"
            label={getShortRoleText(params.value ?? '')}
          />
        </CellElement>
      ),
    },
  ];
};
