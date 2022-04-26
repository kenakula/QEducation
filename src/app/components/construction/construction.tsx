import React from 'react';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Box, Typography } from '@mui/material';

interface Props {
  text?: string;
}

const Construction = (props: Props): JSX.Element => (
  <Box
    sx={{
      width: '250px',
      height: '250px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <EngineeringIcon sx={{ fontSize: '120px' }} color="primary" />
    <Typography variant="h5" textAlign="center">
      {props.text}
    </Typography>
  </Box>
);

Construction.defaultProps = {
  text: 'Under construction',
};

export default Construction;
