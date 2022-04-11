import { Accordion, Box, styled } from '@mui/material';

export const PageTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),

  '& h1': {
    margin: 0,
  },
}));

export const AccordionElement = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  '& ul': {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiAccordionDetails-root': {
      padding: 0,
    },
    '& .MuiButton-root': {
      textAlign: 'left',
    },
  },
}));

export const ArticleContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: `0 ${theme.spacing(2)}`,
  maxWidth: '100%',
  '& iframe': {
    maxWidth: '100%',
  },
  '& img': {
    maxWidth: '100%',
  },
}));
