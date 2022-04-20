import { Box, Fade, Grid, Typography, useMediaQuery } from '@mui/material';
import Loader from 'app/components/loader/loader';
import Main from 'app/components/main/main';
import PageTitle from 'app/components/page-title/page-title';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';
import { BootState } from 'app/constants/boot-state';
import { Category } from 'app/constants/category-model';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import CategoriesList from './sub-components/categories-list';

const AdminCategoriesPage = observer((): JSX.Element => {
  const store = useAdminStore();
  const matchMobile = useMediaQuery('(min-width:900px)');

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    if (!store.isInited) {
      store.init();
    }
  }, []);

  const handleCategoryClick = (item: Category): void => {
    setSelectedCategory(item);
  };

  switch (store.bootState) {
    case BootState.Success:
      return (
        <Main>
          <PageTitle>Категории</PageTitle>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={matchMobile ? true : Boolean(selectedCategory)}>
                <Box>
                  <CategoriesList
                    onClick={handleCategoryClick}
                    list={store.categories}
                  />
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              {!selectedCategory && (
                <Typography variant="h4">
                  Выберите категорию чтобы редактировать
                </Typography>
              )}
              <Fade in={!!selectedCategory}>
                <Box>редактировать</Box>
              </Fade>
            </Grid>
          </Grid>
        </Main>
      );
    case BootState.Error:
      return <TechnicalIssues />;
    default:
      return <Loader />;
  }
});

export default AdminCategoriesPage;
