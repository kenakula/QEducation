import React from 'react';
import { styled, Typography } from '@mui/material';

const TitleElement = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    ...theme.typography.h6,
  },
}));

export const PageTitle = (props: {
  children: React.ReactNode;
}): JSX.Element => <TitleElement variant="h1">{props.children}</TitleElement>;
