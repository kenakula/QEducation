import { Box, styled } from '@mui/material';
import { ColorMode, useThemeStore } from 'app/stores/theme-store/theme-store';
import React from 'react';
import './style.scss';

const LoaderContaienr = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  '& div::after': {
    background: theme.palette.text.primary,
  },
}));

const Loader = (): JSX.Element => {
  const { mode } = useThemeStore();

  return (
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
};

export default Loader;
