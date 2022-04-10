import { GridRowParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { CustomNoRowsOverlay } from './sub-components/no-rows-overlay';
import { CustomToolbar, IToolbarFields } from './sub-components/custom-toolbar';
import { CustomPagination } from './sub-components/custom-pagination';
import { CustomLoader } from './sub-components/custom-loader';
import { GridElement } from './sub-components/elements';
import { GridColumn } from 'app/constants/table-constants';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';

interface Props<T> {
  columns: GridColumn[];
  rows: T[];
  onDbClick?: (id: string) => void;
  onClick?: (id: string) => void;
  rowIdField?: string;
  toolbarFields?: IToolbarFields[];
  filterParams?: any;
  loading?: boolean;
  initialState?: GridInitialStateCommunity;
}

const DataGridComponent = <T,>(props: Props<T>): JSX.Element => {
  const {
    columns,
    rows,
    onDbClick,
    rowIdField,
    onClick,
    toolbarFields,
    filterParams,
    loading,
    initialState,
  } = props;
  const [rowsArr, setRowsArr] = useState<T[]>(rows);

  useEffect(() => {
    setRowsArr(rows);
  }, [rows]);

  const dbClickHandler = (params: GridRowParams): void => {
    if (onDbClick) {
      onDbClick(params.id as string);
    }
  };

  const clickHandler = (params: GridRowParams): void => {
    if (onClick) {
      onClick(params.id as string);
    }
  };

  return (
    <GridElement
      loading={loading}
      autoHeight
      density="comfortable"
      columns={columns}
      rows={rowsArr}
      onRowDoubleClick={dbClickHandler}
      onRowClick={onClick ? clickHandler : () => {}}
      components={{
        Toolbar: toolbarFields ? CustomToolbar : null,
        Pagination: CustomPagination,
        NoRowsOverlay: CustomNoRowsOverlay,
        LoadingOverlay: CustomLoader,
      }}
      componentsProps={{
        toolbar: {
          arraySetter: setRowsArr,
          originalRowsData: rows,
          fields: toolbarFields,
          filterParamsModel: filterParams,
        },
      }}
      pageSize={20}
      disableSelectionOnClick
      getRowId={row => (rowIdField ? row[rowIdField] : row.id)}
      hideFooterSelectedRowCount
      initialState={initialState}
    />
  );
};

export default DataGridComponent;
