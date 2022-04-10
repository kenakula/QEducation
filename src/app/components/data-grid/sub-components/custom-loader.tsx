import { LinearProgress } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';
import React from 'react';

export const CustomLoader = (): JSX.Element => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);
