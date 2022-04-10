import { Grid, ListItem, Typography } from '@mui/material';
import Loader from 'app/components/loader/loader';
import Main from 'app/components/main/main';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';
import { BootState } from 'app/constants/boot-state';
import { UserRole } from 'app/constants/user-roles';
import { Routes } from 'app/routes/routes';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RoleTabs from './sub-components/tabs';

import { ReactComponent as ArticleImage } from 'assets/images/article-image.svg';
import {
  CategoriesContainer,
  CategoriesSection,
  ImageContainer,
} from './sub-components/styled-elements';
import { Category } from 'app/constants/category-model';

interface LocationParams {
  tabId: string;
}

const MainPage = observer((): JSX.Element => {
  const store = useMainPageStore();
  const params = useParams<LocationParams>();
  const history = useHistory();

  const [currentTab, setCurrentTab] = useState<UserRole>(UserRole.Doctor);

  useEffect(() => {
    store.init();
  }, [store]);

  useEffect(() => {
    const tabId = params.tabId;

    if (tabId) {
      setCurrentTab(tabId.slice(1) as UserRole);
    }
  }, [params.tabId]);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: UserRole,
  ): void => {
    setCurrentTab(newValue);
    history.push(`${Routes.MAIN}/:${newValue}`);
  };

  const renderContent = (): JSX.Element => {
    switch (store.bootState) {
      case BootState.Success:
        return (
          <>
            {store.profileInfo.isSuperAdmin ? (
              <RoleTabs
                currentTab={currentTab}
                handleChange={handleTabChange}
              />
            ) : null}
            <CategoriesSection container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
                  Выберите категорию
                </Typography>
                <ImageContainer>
                  <ArticleImage width="100%" height={300} />
                </ImageContainer>
              </Grid>
              <Grid xs={12} md={6} item>
                <CategoriesContainer>
                  {store.categories.map((item: Category) => (
                    <ListItem key={item.label}>{item.label}</ListItem>
                  ))}
                </CategoriesContainer>
              </Grid>
            </CategoriesSection>
          </>
        );
      case BootState.Error:
        return <TechnicalIssues />;
      default:
        return <Loader />;
    }
  };

  return <Main>{renderContent()}</Main>;
});

export default MainPage;
