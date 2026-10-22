import { HeadCell } from "../components";
import { TermTable } from "../tables";

export const termHC: HeadCell<TermTable>[] = [
    {
        Id: 'ChapterTitle',
        numeric: false,
        disablePadding: true,
        label: 'Volume',
    },
    {
        Id: 'Term',
        numeric: false,
        disablePadding: true,
        label: 'Term',
    },
    /*{
        Id: 'Focus',
        numeric: false,
        disablePadding: false,
        label: 'Focus',
    },*/
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