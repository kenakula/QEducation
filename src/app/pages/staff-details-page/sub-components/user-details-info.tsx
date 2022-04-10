import { UserModel } from 'app/constants/user-model';
import React, { useState } from 'react';
import { Link, List, Switch, Typography } from '@mui/material';
import { InfoContainer, InfoListItem, InfoListLabel } from './elements';
import { observer } from 'mobx-react-lite';
import { AdminStore } from 'app/stores/admin-store/admin-store';

interface Props {
  data: UserModel;
  store: AdminStore;
}

const UserDetailsInfo = observer((props: Props): JSX.Element => {
  const { data, store } = props;

  const [adminStatePending, setAdminStatePending] = useState(false);

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAdminStatePending(true);
    store.toggleSuperAdmin(data.uid, event.target.checked).then(() => {
      store.getUserInfo(data.uid);
      setAdminStatePending(false);
    });
  };

  return (
    <InfoContainer>
      <List>
        <InfoListItem divider>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            {`${data.lastName} ${data.firstName} ${data.middleName ?? null}`}
          </Typography>
        </InfoListItem>
        <InfoListItem divider>
          <InfoListLabel>Должность:</InfoListLabel>
          <Typography>{data.role}</Typography>
        </InfoListItem>
        <InfoListItem divider>
          <InfoListLabel>Почта:</InfoListLabel>
          <Link
            variant="body1"
            href={`mailto: ${data.email}`}
            underline="hover"
          >
            {data.email}
          </Link>
        </InfoListItem>

        <InfoListItem divider>
          <InfoListLabel sx={{ mr: 2 }}>Админ. сайта:</InfoListLabel>
          <Switch
            disabled={adminStatePending}
            onChange={handleSwitch}
            checked={data.isSuperAdmin}
          />
        </InfoListItem>
      </List>
    </InfoContainer>
  );
});

export default UserDetailsInfo;
