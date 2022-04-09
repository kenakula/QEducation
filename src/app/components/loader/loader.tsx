import { Box } from '@mui/material';
import { ColorMode, useThemeStore } from 'app/stores/theme-store/theme-store';
import React from 'react';
import './style.scss';

const Loader = (): JSX.Element => {
  const { mode } = useThemeStore();

  return (
    <Box
      className="lds-spinner"
      sx={{
        '& div:after': {
          background: mode === ColorMode.Light ? '#222222' : '#F9F8F8',
        },
      }}
    >
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
    </Box>
  );
};

export default Loader;
