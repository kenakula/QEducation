import { Box, styled, Typography } from '@mui/material';

const InputContainer = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '&:last-of-type': {
    marginBottom: '0',
  },
}));

const CustomInputLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  alignItems: 'center',
  minWidth: '150px',
  marginRight: theme.spacing(2),
}));

const MainInfoBox = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  flexGrow: 1,
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  border: '2px solid',
  borderColor: theme.palette.grey[300],
  borderRadius: '10px',
}));

export { InputContainer, CustomInputLabel, MainInfoBox };
