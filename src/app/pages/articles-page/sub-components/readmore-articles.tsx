import { ReadMoreItem } from 'app/constants/article-model';
import React, { useState } from 'react';
import { AccordionElement } from './styled-elements';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';

interface Props {
  list: ReadMoreItem[];
}

const ReadMoreArticles = (props: Props): JSX.Element => {
  const { list } = props;

  const [articlesExpanded, setArticlesExpanded] = useState(false);
  const handleArticlesAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean,
  ): void => {
    setArticlesExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={articlesExpanded}
      onChange={handleArticlesAccordionChange}
      elevation={0}
      sx={{ mt: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography variant="h6">Прикрепленные статьи</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>articles</AccordionDetails>
    </Accordion>
  );
};

export default ReadMoreArticles;
