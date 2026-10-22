import { HeadCell } from "../components";
import { TermLineTable } from "../tables";

export const termLineHC: HeadCell<TermLineTable>[] = [
    {
        Id: 'TermName',
        numeric: false,
        disablePadding: true,
        label: 'Focus',
    },
    {
        Id: 'Category',
        numeric: false,
        disablePadding: true,
        label: 'Category',
    },
    {
        Id: 'Term',
        numeric: false,
        disablePadding: true,
        label: 'Term',
    },
    {
        Id: 'DateCreated',
        numeric: true,
        disablePadding: false,
        label: 'Date',
    },
    {
        Id: 'Id',
        numeric: true,
        disablePadding: false,
        label: 'Actions',
    },
  ];