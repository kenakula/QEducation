import { Box } from '@mui/material';
import React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Main = (props: Props): JSX.Element => {
  const { children } = props;

  return <Box component="main">{children}</Box>;
};

export default Main;
