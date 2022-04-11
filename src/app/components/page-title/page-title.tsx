import React from 'react';
import { styled, Typography } from '@mui/material';

const TitleElement = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    ...theme.typography.h4,
  },
}));

const PageTitle = (props: { children: React.ReactNode }): JSX.Element => {
  return <TitleElement variant="h1">{props.children}</TitleElement>;
};

export default PageTitle;
