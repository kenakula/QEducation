/* eslint-disable react-hooks/exhaustive-deps */
import Main from 'app/components/main/main';
import { BootState } from 'app/constants/boot-state';
import { UserRole } from 'app/constants/user-roles';
import {
  PageContentType,
  useMainPageStore,
} from 'app/stores/main-page-store/main-page-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { TabItemPanel } from './sub-components/styled-elements';
import TabsComponent, {
  TabsItem,
} from 'app/components/tabs-component/tabs-component';
import { Routes } from 'app/routes/routes';
import { TabContext } from '@mui/lab';

import Vebinars from './sub-components/vebinars';
import { useLocation, useHistory } from 'react-router-dom';
import Categories from 'app/pages/main-page/sub-components/categories';
import qs from 'qs';

const roleTabs: TabsItem<UserRole>[] = [
  {
    value: UserRole.Doctor,
    label: 'Врачи',
  },
  {
    value: UserRole.Administrator,
    label: 'Администраторы',
  },
  {
    value: UserRole.Nurse,
    label: 'Медсёстры',
  },
];

const contentTabs: TabsItem<PageContentType>[] = [
  {
    value: PageContentType.Categories,
    label: 'Статьи',
  },
  {
    value: PageContentType.Vebinars,
    label: 'Вебинары',
  },
];

const MainPage = observer((): JSX.Element => {
  const store = useMainPageStore();
  const location = useLocation();
  const history = useHistory();

  const getTabFromSearchParams = (params: any): void => {
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
      const params = qs.parse(location.search.slice(1));

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

  return (
    <Main>
      {/* role tabs */}
      {store.bootState === BootState.Success && store.isSuperAdmin
        ? renderUserRoleTabs()
        : null}
      {/* page tabs */}

      <TabsComponent<PageContentType>
        currentTab={store.selectedContentTab}
        handleChange={handleContentTabChange}
        tabs={contentTabs}
      />
      <TabContext value={store.selectedContentTab}>
        <TabItemPanel value={PageContentType.Categories}>
          <Categories />
        </TabItemPanel>
        <TabItemPanel value={PageContentType.Vebinars}>
          <Vebinars />
        </TabItemPanel>
      </TabContext>
    </Main>
  );
});

export default MainPage;
