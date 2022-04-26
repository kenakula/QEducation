/* eslint-disable react-hooks/exhaustive-deps */
import Main from 'app/components/main/main';
import { BootState } from 'app/constants/boot-state';
import { UserRole } from 'app/constants/user-roles';
import { useMainPageStore } from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { TabItemPanel } from './sub-components/styled-elements';
import TabsComponent from 'app/components/tabs-component/tabs-component';
import { Routes } from 'app/routes/routes';
import { TabContext } from '@mui/lab';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'qs';
import { contentTabs, PageContentType, roleTabs } from './tabs';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';
import Loader from 'app/components/loader/loader';
import Vebinars from './sub-components/tabs/vebinars';
import Categories from './sub-components/tabs/categories';
import Construction from 'app/components/construction/construction';

interface PageParams {
  tab?: string;
  role?: string;
}

const MainPage = observer((): JSX.Element => {
  const store = useMainPageStore();
  const location = useLocation();
  const history = useHistory();

  const getTabFromSearchParams = (params: PageParams): void => {
    if (params.tab) {
      store.setSelectedContentTab(params.tab as PageContentType);
    }
  };

  useEffect(() => {
    store.init();
  }, []);

  useEffect(() => {
    if (store.selectedContentTab && !location.search) {
      history.push({ search: `tab=${store.selectedContentTab}` });
    }
  }, [store.selectedContentTab]);

  useEffect(() => {
    if (location.search) {
      const params = qs.parse(location.search.slice(1)) as PageParams;

      getTabFromSearchParams(params);
    }
  }, [location.search]);

  const handleRoleTabChange = (
    event: React.SyntheticEvent,
    newValue: UserRole,
  ): void => {
    store.getUserCategories(newValue);
    store.setSelectedRole(newValue);
  };

  const handleContentTabChange = (
    event: React.SyntheticEvent,
    newValue: PageContentType,
  ): void => {
    store.setSelectedContentTab(newValue);
    history.push({
      pathname: Routes.MAIN,
      search: `tab=${newValue}`,
    });
  };

  const renderUserRoleTabs = (): JSX.Element => (
    <TabsComponent<UserRole>
      currentTab={store.selectedRole}
      handleChange={handleRoleTabChange}
      tabs={roleTabs}
    />
  );

  const renderContentTabs = (): JSX.Element => (
    <TabsComponent<PageContentType>
      currentTab={store.selectedContentTab}
      handleChange={handleContentTabChange}
      tabs={contentTabs}
    />
  );

  switch (store.bootState) {
    case BootState.Success:
      return (
        <Main>
          {store.isSuperAdmin ? renderUserRoleTabs() : null}
          {renderContentTabs()}
          <TabContext value={store.selectedContentTab}>
            <TabItemPanel value={PageContentType.Categories}>
              <Categories />
            </TabItemPanel>
            <TabItemPanel value={PageContentType.Vebinars}>
              <Vebinars />
            </TabItemPanel>
            <TabItemPanel value={PageContentType.Checklists}>
              <Construction text="Тут скоро будут чеклисты" />
            </TabItemPanel>
            <TabItemPanel value={PageContentType.Scripts}>
              <Construction text="Тут скоро будут скрипты" />
            </TabItemPanel>
          </TabContext>
        </Main>
      );
    case BootState.Error:
      return <TechnicalIssues />;
    default:
      return <Loader />;
  }
});

export default MainPage;
