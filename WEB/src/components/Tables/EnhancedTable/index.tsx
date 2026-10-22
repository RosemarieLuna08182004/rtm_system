import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { TextField } from '@mui/material';
import { ButtonType, DBTable, DialogType, EnhancedTableProps, Order, ToastType } from '../../../types';
import { displayToast, formatDateToMMDDYY, getComparator, stableSort, truncate } from '../../../utils';
import { useAxiosPrivate, useToggle } from '../../../hooks';
import { useState, MouseEvent, ChangeEvent, useMemo, useCallback } from 'react';
import { TableHeader, TableToolbar, NoRecord } from '..';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { ConfirmationDialog } from '../../Dialogs';
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_URL, Success } from '../../../shared';
import * as S from '../../../styles'
import { CircleButton } from '../../FormInputs';
import { colors } from '../../../styles';
import { Skeleton } from '../../Skeleton';

export const EnhancedTable = <T extends Record<string, any>>({ Rows, HeadCells,  ClassName, OnRecordDelete, Title = 'NA', RemoveTable= DBTable.DEFAULT, IsRemove = true, IsLoading = false}: EnhancedTableProps<T>) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(HeadCells[0].Id)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, toggleModal] = useToggle(false); 
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const handleRequestSort = (_event: MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (_event: MouseEvent<unknown>, id: any) => {
    if (RemoveTable === DBTable.CHAPTER) RemoveTable=DBTable.VOLUME
    if (RemoveTable === DBTable.TERM_LINE_ROUTE) RemoveTable=DBTable.TERM_LINE
     navigate(`/a/${RemoveTable}/d/${id}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggle = (event: MouseEvent<unknown>, Id: any) => {
    event.preventDefault();
    event.stopPropagation();
    setSelected(parseInt(Id, 10));
    toggleModal();
  };

  const filteredRows = useMemo(() => {
    return Rows.filter((row: { [x: string]: { toString: () => string; }; }) =>
      Object.keys(row).some((key) =>
        row[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [Rows, searchQuery]);

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const removeRecord = useCallback(async () => {
    if (selected !== null) {
      try {
        const response = await axios.delete(`${BASE_URL}/${RemoveTable}/remove/${selected}`);
        if (response.data.data) {
          OnRecordDelete(); 
          displayToast(Success.m00003, ToastType.success)
        }
        else displayToast(response.data.message, ToastType.error)
      } catch (error: any) {
        displayToast(error?.response?.data?.message, ToastType.error)
      } finally {
        toggleModal();
      }
    }
  }, [selected, axios, OnRecordDelete, toggleModal]);

  const renderModal = () => {
    if (!modalIsOpen) return null;
    return (
      <ConfirmationDialog
        ClassName='md:w-2/6 w-11/12'
        dialogType={DialogType.delete}
        close={toggleModal}
        title="Delete Record"
        message="Are you sure to delete this?"
        confirm={removeRecord}
      />
    );
  };

  return (
    <>
      <S.Container className={twMerge('w-full h-full overflow-auto ', ClassName)}>
        <TableToolbar Title={Title}>
          <TextField sx={{width: { xs: '100%', sm: '100%', md: '400px' }}} label="Search" id="Search" size="small" name="filter" value={searchQuery} onChange={handleSearchChange} placeholder={'Search'}/>
        </TableToolbar>
        <TableContainer sx={{borderBottom:`1px solid ${colors.palette.neutral['100']}`}}>
          <Table sx={{ minWidth: '100%', minHeight: ((Rows.length ===0) && IsRemove) ? 'calc(100vh - 330px)':'' }} aria-labelledby="tableTitle" size={'small'}>
            <TableHeader  order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={Rows.length} headCells={HeadCells}/>
            <TableBody >
            {IsLoading ?(<>
              <TableRow key={'no-record'}>
                <TableCell key={'no-record-cell'} colSpan={HeadCells.length} sx={{ border: 'none !important' }}>
                 <Skeleton/>
                </TableCell>
              </TableRow>
            </>) :
            visibleRows.length > 0 ? (
              visibleRows.map((row, _index) => (
                <TableRow
                  hover={false}
                  onClick={(event) => handleClick(event, row['Id'])}
                  tabIndex={-1}
                  key={row['Id']}
                  sx={{ cursor: 'pointer', position: 'relative'}}
                >
                  {HeadCells.map((HeadCell) => {
                    const renderCellContent = () => {
                      switch (HeadCell.Id) {
                        case 'DateCreated':
                          return formatDateToMMDDYY(row[HeadCell.Id].toString());
                        case 'Coins':
                        case 'Price':
                            return Number(row[HeadCell.Id]??0).toFixed(2);
                        case 'Id':
                          return IsRemove && (
                            <CircleButton
                              OnClick={(event: React.MouseEvent<unknown>) => toggle(event, row['Id'])}
                              IsNotification={false}
                              Icon={<DeleteIcon className="text-primary" />}
                              Type={ButtonType.button}
                            />
                          );
                        default:
                          return row[HeadCell.Id]?truncate(String(row[HeadCell.Id]??''), 100):'';
                      }
                    };

                    return (
                      <TableCell
                        key={HeadCell.Id as string}
                        align={HeadCell.numeric ? 'right' : 'left'}
                        padding="normal"
                      >
                        {renderCellContent()}
                      </TableCell>
                    );
                  })}

                </TableRow>
              ))
            ) : (
              <TableRow key={'no-record'}>
                <TableCell key={'no-record-cell'} colSpan={HeadCells.length} sx={{ border: 'none !important' }}>
                  <NoRecord Message="No records were found" />
                </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination sx={{ width: '100%' }} rowsPerPageOptions={[]} component="div" count={Rows.length} rowsPerPage={rowsPerPage} page={page}  onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
        {renderModal()}
      </S.Container>
    </>
  );
};
