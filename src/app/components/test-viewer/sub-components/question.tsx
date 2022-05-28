import { Box, Typography } from '@mui/material';
import { QuestionModel } from 'app/constants/test-model';
import React from 'react';

interface Props {
  question: QuestionModel | null;
}

export const Question = (props: Props): JSX.Element => {
  const { question } = props;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2">
        Невероятно интересный текст вопроса про то что будет если не делать
        что-то странное
      </Typography>
    </Box>
  );
};
