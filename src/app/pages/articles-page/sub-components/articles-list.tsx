import { Button } from '@mui/material';
import { ArticleModel } from 'app/constants/article-model';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
  list: ArticleModel[];
  readArticles: string[];
}

const ArticlesList = (props: Props): JSX.Element => {
  const { list, readArticles } = props;

  const history = useHistory();

  const handleClick = (id: string): void => {
    history.push({ search: `?${id}` });
  };

  return (
    <ul>
      {list.map(item => (
        <li key={item.id}>
          <Button
            size="small"
            color="inherit"
            onClick={() => handleClick(item.id)}
            endIcon={
              readArticles.includes(item.id) ? (
                <CheckCircleOutlineIcon color="success" />
              ) : undefined
            }
          >
            {item.title}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default ArticlesList;
