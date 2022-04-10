import React from 'react';
import ContainerElement from '@mui/material/Container';
import { SxProps } from '@mui/material';

interface Props {
  children: JSX.Element | JSX.Element[] | React.ReactNode;
  sx?: SxProps;
}

const Container = (props: Props): JSX.Element => (
  <ContainerElement sx={props.sx} maxWidth="xl">
    {props.children}
  </ContainerElement>
);

export default Container;
