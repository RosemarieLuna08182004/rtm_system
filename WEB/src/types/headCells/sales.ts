import { HeadCell } from "../components";
import { SalesTable } from "../tables";

export const salesHC: HeadCell<SalesTable>[] = [
    {
        Id: 'SalesNumber',
        numeric: false,
        disablePadding: true,
        label: 'Sales No.',
    },
    {
        Id: 'SalesDate',
        numeric: false,
        disablePadding: true,
        label: 'Sales Date',
    },
    {
        Id: 'ProductName',
        numeric: false,
        disablePadding: false,
        label: 'ProductName',
    },
    {
        Id: 'TotalAmount',
        numeric: true,
        disablePadding: false,
        label: 'TotalAmount',
    },
    {
        Id: 'DateCreated',
        numeric: true,
        disablePadding: false,
        label: 'Date',
    },
  ];