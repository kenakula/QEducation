import { Box, Button, IconButton, Typography } from '@mui/material';
import { QuestionModel, TestModel } from 'app/constants/test-model';
import React, { useEffect, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Question } from './sub-components/question';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Props {
  test: TestModel;
  viewerTitle?: string;
}

export const TestViewer = (props: Props): JSX.Element => {
  const { test, viewerTitle } = props;

  const [currentQuestion, setCurrentQuestion] = useState<QuestionModel | null>(
    null,
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [optionsSelected, setOptionsSelected] = useState<string[]>([]);

  useEffect(() => {
    setCurrentQuestion(test.questions[0]);
    setQuestionIndex(0);
  }, []);

  const handleStartTest = (): void => {
    setCurrentQuestion(test.questions[0]);
    setQuestionIndex(0);
  };

  const goToNextQuestion = (): void => {
    const index = questionIndex + 1;

    if (index < test.questions.length) {
      setCurrentQuestion(test.questions[index]);
      setQuestionIndex(index);
    }
  };

  const goToPrevQuestion = (): void => {
    const index = questionIndex - 1;

    if (index >= 0) {
      setCurrentQuestion(test.questions[index]);
      setQuestionIndex(index);
    }
  };

  const handleOptionClick = (title: string): void => {
    const isSelected = optionsSelected.includes(title);

    if (isSelected) {
      setOptionsSelected(prev => prev.filter(item => item !== title));
      return;
    }

    setOptionsSelected(prev => [...prev, title]);
  };

  return (
    <Box>
      <Typography variant="body1">{test.title}</Typography>
      {test.description && (
        <Typography variant="body2">{test.description}</Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Вопрос {questionIndex + 1} /{' '}
            <Typography variant="caption">{test.questions.length}</Typography>
          </Typography>
        </Box>
        {!!currentQuestion ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {currentQuestion.title}
            </Typography>
            {currentQuestion.options
              ? currentQuestion.options.map(option => (
                  <Box
                    key={option.title}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 40px 10px 10px',
                      borderRadius: '10px',
                      border: '1px solid gray',
                      cursor: 'pointer',
                      mb: 1,
                    }}
                    onClick={() => handleOptionClick(option.title)}
                  >
                    <Typography variant="body2">{option.title}</Typography>
                    <Box
                      sx={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {optionsSelected.includes(option.title) ? (
                        <CheckBoxIcon color="success" fontSize="small" />
                      ) : (
                        <CheckBoxOutlineBlankIcon fontSize="small" />
                      )}
                    </Box>
                  </Box>
                ))
              : null}
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size="small" variant="outlined" color="error">
            Выйти
          </Button>
          <Button size="small" variant="outlined">
            Ответить
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
