import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

export const GridElement = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  width: '100%',
  '& .MuiDataGrid-columnHeaders': {
    border: 'none',
  },
  '& .MuiDataGrid-row': {
    cursor: 'pointer',
    transition: theme.transitions.create('background', {
      duration: 300,
      easing: 'ease-in',
    }),
  },
  '& .MuiDataGrid-cell': {
    padding: '10px',
    '& p, & .MuiChip-label, & .MuiBox-root': {
      fontSize: '12px',
    },
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.up('md')]: {
      '& p, & .MuiBox-root': {
        fontSize: '16px',
      },
      '& .MuiChip-label': {
        fontSize: '14px',
      },
    },
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '14px',

    [theme.breakpoints.up('md')]: {
      fontSize: '16px',
    },
  },
}));
