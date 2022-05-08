import { Main } from 'app/components/main';
import React from 'react';
import { ReactComponent as NotFoundImage } from 'assets/images/not-found-image.svg';
import { Banner } from './styled-elements';
import { Box, Typography } from '@mui/material';

const NotFoundPage = (): JSX.Element => (
  <Main>
    <Banner>
      <Typography variant="h5" component="h1">
        Страница не найдена
      </Typography>
      <Box>
        <NotFoundImage />
      </Box>
    </Banner>
  </Main>
);

export default NotFoundPage;
