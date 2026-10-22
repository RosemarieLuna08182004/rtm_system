import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { MouseEvent } from 'react'
import { TableHeaderProps } from '../../../../types'

export const TableHeader = <T,>({order, orderBy,  onRequestSort, headCells}: TableHeaderProps<T>) => {
  const createSortHandler = (property: keyof T) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.Id as string} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.Id ? order : false} >
            <TableSortLabel active={orderBy === headCell.Id} direction={orderBy === headCell.Id ? order : 'asc'} onClick={createSortHandler(headCell.Id)} >
              {headCell.label}
              {orderBy === headCell.Id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
