import { Typography } from '@mui/material';
import { Category } from 'app/constants/category-model';
import React from 'react';
import { CategoriesContainer, CategoryItem } from './styled-elements';

interface Props {
  list: Category[];
  onClick: (item: Category) => void;
}

const CategoriesList = (props: Props): JSX.Element => {
  const { list, onClick } = props;

  return (
    <CategoriesContainer>
      {list.map(item => (
        <CategoryItem key={item.id} onClick={() => onClick(item)}>
          {item.title}
          <Typography variant="caption">{item.description}</Typography>
        </CategoryItem>
      ))}
    </CategoriesContainer>
  );
};

export default CategoriesList;
