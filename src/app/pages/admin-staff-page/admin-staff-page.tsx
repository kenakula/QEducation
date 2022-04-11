import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import DataGridComponent from 'app/components/data-grid/data-grid-component';
import { IToolbarFields } from 'app/components/data-grid/sub-components/custom-toolbar';
import Main from 'app/components/main/main';
import PageTitle from 'app/components/page-title/page-title';
import { BootState } from 'app/constants/boot-state';
import { UserModel } from 'app/constants/user-model';
import { Routes } from 'app/routes/routes';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { getColumns } from './sub-components/columns';

const AdminStaffPage = observer((): JSX.Element => {
  const adminStore = useAdminStore();
  const history = useHistory();

  const moveToUser = (staffId: string): void =>
    history.push(
      generatePath(Routes.ADMIN_STAFF_DETAILS, {
        staffId,
      }),
    );

  const theme = useTheme();
  const matchesTablet = useMediaQuery(theme.breakpoints.up('md'));
  const columns = getColumns({ matchTablet: matchesTablet });

  const filterFields: IToolbarFields[] = useMemo(
    () => [
      {
        type: 'search',
        fieldName: 'title',
        label: 'Поиск',
        gloabalSearch: true,
      },
    ],
    [],
  );

  const filterParams: any = {
    title: '',
  };

  const gridInitialState: GridInitialStateCommunity = {
    sorting: {
      sortModel: [{ field: 'title', sort: 'asc' }],
    },
  };

  useEffect(() => {
    if (!adminStore.isInited) {
      adminStore.init();
    }
  }, [adminStore]);

  return (
    <Main>
      <PageTitle>Сотрудники</PageTitle>
      {adminStore.bootState === BootState.Success ? (
        <DataGridComponent<UserModel>
          columns={columns}
          rows={toJS(adminStore.users)}
          onClick={id => moveToUser(id)}
          toolbarFields={filterFields}
          filterParams={filterParams}
          rowIdField="uid"
          initialState={gridInitialState}
          loading={adminStore.usersLoading}
        />
      ) : (
        <Skeleton width="100%" height="100%" />
      )}
    </Main>
  );
});

export default AdminStaffPage;
