/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from '@mui/material';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPhoto } from './sub-components/elements';
import PersonIcon from '@mui/icons-material/Person';
import UserDetailsInfo from './sub-components/user-details-info';
import UserDetailsActions from './sub-components/user-details-actions';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { observer } from 'mobx-react-lite';
import Loader from 'app/components/loader/loader';
import TechnicalIssues from 'app/components/technical-issues/technical-issues';
import Main from 'app/components/main/main';

interface PageParams {
  staffId: string;
}

const StaffDetailsPage = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const params = useParams<PageParams>();
  const { currentUser } = useAuthStore();

  const [profileDeleted, setProfileDeleted] = useState(false);

  useEffect(() => {
    adminStore.init();
    adminStore.getUserInfo(params.staffId);
  }, []);

  if (profileDeleted) {
    return <TechnicalIssues header="Профиль удален" message="" code="" />;
  }

  return (
    <Main>
      {adminStore.userDetailsInfo ? (
        <Grid spacing={2} container rowSpacing={6}>
          <Grid item xs={12} sm={4}>
            <UserPhoto variant="rounded">
              <PersonIcon />
            </UserPhoto>
          </Grid>
          <Grid item xs={12} sm={8}>
            <UserDetailsInfo
              store={adminStore}
              data={adminStore.userDetailsInfo}
            />
          </Grid>
          <Grid item xs={12}>
            <UserDetailsActions
              setDeleted={setProfileDeleted}
              store={adminStore}
              data={adminStore.userDetailsInfo}
              currentUserId={currentUser?.uid}
            />
          </Grid>
        </Grid>
      ) : (
        <Loader />
      )}
    </Main>
  );
});

export default StaffDetailsPage;
