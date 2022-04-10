import { Tab, Tabs } from '@mui/material';
import { UserRole } from 'app/constants/user-roles';
import React from 'react';
import { TabsContainer } from './styled-elements';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  currentTab: UserRole;
  handleChange: (event: React.SyntheticEvent, newValue: UserRole) => void;
}

const RoleTabs = (props: Props): JSX.Element => {
  const { currentTab, handleChange } = props;

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
        <Tab value={UserRole.Doctor} label="Для врачей" />
        <Tab value={UserRole.Administrator} label="Для админов" />
        <Tab value={UserRole.Nurse} label="Для медсестёр" />
      </Tabs>
    </TabsContainer>
  );
};

export default RoleTabs;
