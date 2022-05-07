import React from 'react';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Typography } from '@mui/material';
import { ComponentContainer } from './sub-components/styled-elements';

interface Props {
  text?: string;
}

export const Construction = (props: Props): JSX.Element => (
  <ComponentContainer>
    <EngineeringIcon color="primary" />
    <Typography variant="h5" textAlign="center">
      {props.text}
    </Typography>
  </ComponentContainer>
);

Construction.defaultProps = {
  text: 'Я работаю над этим',
};
