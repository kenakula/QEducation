import { Accordion, Box, ListItem, styled } from '@mui/material';

export const PageTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),

  '& h1': {
    margin: `0 auto ${theme.spacing(2)} 0`,
    width: '100%',
    textAlign: 'center',
  },

  '& .MuiButton-root': {
    flexShrink: 0,
    marginRight: theme.spacing(1),

    '&:last-child': {
      marginRight: 0,
    },
  },

  [theme.breakpoints.up('md')]: {
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',

    '& h1': {
      width: 'auto',
      marginBottom: 0,
      textAlign: 'left',
    },
  },
}));

export const PageContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
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
    minWidth: '350px',
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiAccordionDetails-root': {
      padding: 0,
    },
    '& .MuiAccordionSummary-root': {
      cursor: 'default',
    },
    '& .MuiAccordionSummary-content': {
      cursor: 'default',

      '&.Mui-expanded': {
        margin: 0,
        minHeight: '20px',
      },
    },
    '& .MuiButton-root': {
      textAlign: 'left',
    },
  },
}));

export const ArticleListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    background: theme.palette.grey[200],
  },
  '& .MuiListItemSecondaryAction-root': {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const ArticleContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  maxWidth: '100%',
  '& iframe': {
    maxWidth: '100%',
  },
  '& img': {
    maxWidth: '100%',
  },
}));
