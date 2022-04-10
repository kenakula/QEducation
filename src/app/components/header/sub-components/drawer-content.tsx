/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, List } from '@mui/material';
import { ColorMode, useThemeStore } from 'app/stores/theme-store/theme-store';
import React from 'react';
import { ListItemLink } from './list-item-link';
import { adminNavList, commonNavList, NavItem } from './main-nav';
import { ColorModeSwitch } from './styled-elements';

interface Props {
  isAdmin?: boolean;
  onClose?: () => void;
}

const DrawerContent = (props: Props): JSX.Element => {
  const { isAdmin, onClose } = props;
  const { mode, toggleColorMode, theme } = useThemeStore();

  const handleSwitchChange = (): void => {
    if (toggleColorMode) {
      toggleColorMode();
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '20px',
        paddingTop: '35px',
        background: theme?.palette.background.default,
        height: '100%',
        '& ul:last-of-type': {
          marginBottom: 'auto',
        },
        '& > span': {
          alignSelf: 'center',
        },
      }}
    >
      <List>
        {commonNavList.map((item: NavItem) => (
          <ListItemLink
            key={item.link}
            to={item.link}
            primary={item.text}
            icon={item.icon}
            disabled={item.disabled}
            clickHandler={() => (onClose ? onClose() : null)}
          />
        ))}
      </List>
      {isAdmin && (
        <>
          <Divider />
          <List>
            {adminNavList.map((item: NavItem) => (
              <ListItemLink
                key={item.link}
                to={item.link}
                primary={item.text}
                icon={item.icon}
                disabled={item.disabled}
                clickHandler={() => (onClose ? onClose() : null)}
              />
            ))}
          </List>
        </>
      )}
      <ColorModeSwitch
        checked={mode === ColorMode.Dark}
        onChange={handleSwitchChange}
      />
    </Box>
  );
};

export default DrawerContent;
