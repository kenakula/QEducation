import React from 'react';
import { styled, Typography, TypographyProps } from '@mui/material';
import { Link } from 'react-router-dom';

export const TextLink = styled(Link)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.primary.dark,
}));

export const CopyrightElement = (props: TypographyProps): JSX.Element => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <TextLink to="/">QEducation</TextLink>
    {' 2022.'}
  </Typography>
);
