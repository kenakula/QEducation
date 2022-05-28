import { Button, useMediaQuery, useTheme } from '@mui/material';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import { DataGridComponent } from 'app/components/data-grid';
import { IToolbarFields } from 'app/components/data-grid/sub-components/custom-toolbar';
import { Main } from 'app/components/main';
import { PageTitle } from 'app/components/typography';
import { Category } from 'app/constants/category-model';
import { TestModel } from 'app/constants/test-model';
import { userRolesOptions } from 'app/constants/user-roles';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { toJS } from 'mobx';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Routes } from 'app/routes/routes';
import { generatePath, useHistory } from 'react-router-dom';
import { SnackBarStateProps } from 'app/constants/snackbar-state-props';
import { getColumns } from './sub-components/columns';
import {
  ModalDialogConfirm,
  ModalDialogConfirmStateProps,
} from 'app/components/modal-dialog';
import { SnackbarAlert } from 'app/components/snackbar-alert';
import {
  PreviewStateProps,
  PreviewTestDialog,
} from './sub-components/preview-test-dialog';

const AdminTestsPage = (): JSX.Element => {
  const adminStore = useAdminStore();
  const history = useHistory();
  const theme = useTheme();
  const matchesTablet = useMediaQuery(theme.breakpoints.up('md'));

  const [snackbarState, setSnackbarState] = useState<SnackBarStateProps>({
    isOpen: false,
    message: 'Тест сохранен',
    alert: 'success',
  });
  const [previewState, setPreviewState] = useState<PreviewStateProps>({
    openState: false,
    test: undefined,
  });
  const [deleteAction, setDeleteAction] =
    useState<ModalDialogConfirmStateProps>({
      id: '',
      isOpen: false,
    });

  if (!adminStore.isInited) {
    adminStore.init();
  }

  useEffect(() => {
    adminStore.fetchTests();
  }, []);

  const editTest = (data: TestModel): void => {
    console.log('editing: ', data);
  };

  const previewTest = (id: string): void => {
    const test = adminStore.tests.find(item => item.id === id);
    setPreviewState(prev => ({ ...prev, openState: true, test }));
  };

  const onLinkCopy = (): void => {
    setSnackbarState(prev => ({
      ...prev,
      isOpen: true,
      message: 'Ссылка скопирована',
      alert: 'success',
    }));
  };

  const columns = getColumns({
    edit: editTest,
    view: previewTest,
    setDelete: setDeleteAction,
    copyLinkCb: onLinkCopy,
    matchTablet: matchesTablet,
  });

  const filterFields: IToolbarFields[] = [
    { type: 'search', fieldName: 'title', label: 'Поиск' },
    {
      type: 'select',
      fieldName: 'roles',
      label: 'Специальности',
      options: userRolesOptions,
    },
    {
      type: 'select',
      fieldName: 'categories',
      label: 'Категории',
      options: adminStore.categories.map((item: Category) => ({
        label: item.title,
        value: item.title,
      })),
    },
    {
      type: 'custom',
      fieldName: 'custom-create',
      label: 'custom-create',
      component: (
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            console.log('create test: ');
          }}
          endIcon={<AddIcon />}
        >
          Создать
        </Button>
      ),
    },
  ];

  const gridInitialState: GridInitialStateCommunity = {
    sorting: {
      sortModel: [{ field: 'created', sort: 'desc' }],
    },
  };

  const filterParams: any = {
    title: '',
    roles: [],
    categories: [],
  };

  return (
    <Main>
      <PageTitle>Все тесты</PageTitle>
      <DataGridComponent<TestModel>
        columns={columns}
        rows={toJS(adminStore.tests)}
        onClick={id => previewTest(id)}
        toolbarFields={filterFields}
        filterParams={filterParams}
        initialState={gridInitialState}
        loading={adminStore.testsLoading}
      />
      <ModalDialogConfirm
        isOpen={deleteAction.isOpen}
        title="Уверены что хотите удалить статью?"
        handleClose={() =>
          setDeleteAction(prev => ({ ...prev, isOpen: false }))
        }
        handleAgree={() => console.log('id: ', deleteAction.id)}
      />
      <PreviewTestDialog
        {...previewState}
        onClose={() => setPreviewState(prev => ({ ...prev, openState: false }))}
      />
      <SnackbarAlert {...snackbarState} setState={setSnackbarState} />
    </Main>
  );
};

export default AdminTestsPage;
