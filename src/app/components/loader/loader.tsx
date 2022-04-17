import { Box, styled } from '@mui/material';
import React from 'react';
import './style.scss';

const LoaderContaienr = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  '& div::after': {
    background: theme.palette.text.primary,
  },
}));

const Loader = (): JSX.Element => (
  <LoaderContaienr className="lds-spinner">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </LoaderContaienr>
);

export default Loader;
