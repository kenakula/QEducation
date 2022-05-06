import { ReadMoreItem } from 'app/constants/article-model';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  Button,
  Typography,
  ListItem,
} from '@mui/material';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { Link, generatePath } from 'react-router-dom';
import { Routes } from 'app/routes/routes';

interface Props {
  list: ReadMoreItem[];
}

const ReadMoreArticles = (props: Props): JSX.Element => {
  const { list } = props;
  const store = useMainPageStore();

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
      <AccordionDetails>
        <List dense>
          {list.map(item => (
            <ListItem
              sx={{ cursor: 'pointer' }}
              key={item.id}
              secondaryAction={
                store.profileInfo &&
                store.profileInfo.readArticles.includes(item.id) ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : undefined
              }
            >
              <Button
                variant="text"
                color="inherit"
                component={Link}
                to={generatePath(Routes.ARTICLE_PAGE, {
                  articleId: item.id,
                })}
                target="_blank"
              >
                {item.title}
              </Button>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReadMoreArticles;
