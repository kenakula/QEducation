import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LinkProps, NavLink } from 'react-router-dom';
import React from 'react';
import { ColorMode, useThemeStore } from 'app/stores/theme-store/theme-store';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  disabled?: boolean;
  clickHandler: () => void;
}

export const ListItemLink = (props: ListItemLinkProps): JSX.Element => {
  const { icon, primary, to, disabled, clickHandler } = props;
  const { mode, theme } = useThemeStore();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function Link(
        itemProps,
        ref,
      ) {
        return (
          <NavLink
            activeStyle={{
              backgroundColor:
                mode === ColorMode.Light
                  ? theme?.palette.grey[300]
                  : theme?.palette.grey[800],
              pointerEvents: 'none',
            }}
            to={to}
            exact
            ref={ref}
            {...itemProps}
            role={undefined}
          />
        );
      }),
    [to, theme?.palette.grey, mode],
  );

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        disabled={disabled}
        onClick={() => clickHandler()}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};
