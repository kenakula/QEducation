import { Box, styled, Tab, Tabs } from '@mui/material';
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TabsItem } from 'app/constants/tabs-model';

export const TabsContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface Props<T> {
  currentTab: T;
  handleChange: (event: React.SyntheticEvent, newValue: T) => void;
  tabs: TabsItem<T>[];
}

const TabsComponent = <T,>(props: Props<T>): JSX.Element => {
  const { currentTab, handleChange, tabs } = props;

  const matches = useMediaQuery('(min-width:600px)');

  return (
    <TabsContainer>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant={matches ? undefined : 'scrollable'}
        scrollButtons="auto"
        centered={matches}
      >
        {tabs.map((item: TabsItem<T>) => (
          <Tab key={item.label} value={item.value} label={item.label} />
        ))}
      </Tabs>
    </TabsContainer>
  );
};

export default TabsComponent;
