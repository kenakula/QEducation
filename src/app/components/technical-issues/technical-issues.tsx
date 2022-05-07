import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { PaperElement } from './sub-components/paper-element';

interface Props {
  code?: string | null;
  header?: string;
  message?: string;
}

export const TechnicalIssues = (props: Props): JSX.Element => {
  const { code, header, message } = props;

  return (
    <PaperElement elevation={3}>
      <Stack spacing={1} alignItems="center" sx={{ position: 'relative' }}>
        <ErrorIcon />
        {code && code.length ? (
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {code}
          </Typography>
        ) : null}
        <Typography variant="h5" component="h1">
          {header}
        </Typography>
        <Typography variant="body2" textAlign="center">
          {message}
        </Typography>
      </Stack>
    </PaperElement>
  );
};

TechnicalIssues.defaultProps = {
  code: '404',
  header: 'Произошла ошибка',
  message: 'Попробуйте позже',
};
