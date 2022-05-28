import { Box, Chip, styled, Tooltip, Typography } from '@mui/material';
import React from 'react';
import {
  GridActionsCellItem,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { Timestamp } from 'firebase/firestore';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getShortRoleText } from 'app/utils/text-helpers';
import { GridColumn } from 'app/constants/table-constants';
import { ArticleModel } from 'app/constants/article-model';
import { copyToClipboard } from 'app/utils/copy-to-clipboard';
import { UserRole } from 'app/constants/user-roles';
import { ModalDialogConfirmStateProps } from 'app/components/modal-dialog';
import { TestModel } from 'app/constants/test-model';

const CellElement = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
  '& .MuiChip-root': {
    margin: '2px',
  },
}));

interface Props {
  edit: (data: TestModel) => void;
  view: (id: string, categoryId: string) => void;
  setDelete: React.Dispatch<React.SetStateAction<ModalDialogConfirmStateProps>>;
  copyLinkCb: () => void;
  matchTablet: boolean;
}

export const getColumns = (props: Props): GridColumn[] => {
  const { edit, view, setDelete, copyLinkCb, matchTablet } = props;

  return [
    {
      field: 'title',
      headerName: 'Название',
      width: 200,
      flex: matchTablet ? 1 : 0,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value}>
          <Typography>{params.value}</Typography>
        </Tooltip>
      ),
    },
    {
      field: 'roles',
      headerName: 'Специальность',
      headerAlign: 'center',
      width: matchTablet ? 200 : 135,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      // mui выдает ошибку если не использовать valueGetter
      valueGetter: (params: GridValueGetterParams<UserRole[]>) =>
        params.value && params.value.join(', '),
      renderCell: (params: any) => (
        <CellElement>
          {params.value.split(', ').map((item: string) => (
            <Chip
              key={item}
              label={getShortRoleText(item)}
              size="small"
              variant="outlined"
            />
          ))}
        </CellElement>
      ),
    },
    {
      field: 'categories',
      headerName: 'Категории',
      width: 210,
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      // mui выдает ошибку если не использовать valueGetter
      valueGetter: (params: GridValueGetterParams<string[]>) =>
        params.value && params.value.join(', '),
      renderCell: (params: any) => (
        <CellElement>
          {params.value.split(', ').map((item: string) => (
            <Chip key={item} label={item} size="small" variant="outlined" />
          ))}
        </CellElement>
      ),
    },
    {
      field: 'created',
      headerName: 'Создан',
      headerAlign: 'center',
      filterable: false,
      disableColumnMenu: true,
      width: matchTablet ? 150 : 110,
      renderCell: (params: GridRenderCellParams<Timestamp>) => (
        <CellElement>
          {params.value && params.value.toDate().toLocaleDateString()}
        </CellElement>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      width: 40,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={params.row.id}
          icon={<ViewCarouselIcon />}
          label="Просмотреть"
          onClick={e => {
            e.stopPropagation();
            view(params.row.id, 'all');
          }}
          showInMenu
        />,
        <GridActionsCellItem
          key={params.row.id}
          icon={<ContentCopyIcon />}
          label="Копировать ссылку"
          onClick={e => {
            e.stopPropagation();
            const domen = window.location.href;
            const url = `${domen.replace('/admin', '')}/tests/${params.row.id}`;
            copyToClipboard(url);
            copyLinkCb();
          }}
          showInMenu
        />,
        <GridActionsCellItem
          key={params.row.id}
          icon={<EditIcon />}
          label="Редактировать"
          onClick={e => {
            e.stopPropagation();
            edit(params.row as TestModel);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          key={params.row.id}
          icon={<DeleteForeverIcon color="error" />}
          label="Удалить"
          onClick={e => {
            e.stopPropagation();
            setDelete(prev => ({
              ...prev,
              id: params.row.id,
              isOpen: true,
            }));
          }}
          showInMenu
        />,
      ],
    },
  ];
};
