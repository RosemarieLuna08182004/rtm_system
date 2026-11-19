import { HeadCell } from "../components";
import { TermLineTable } from "../tables";

export const termLineHC: HeadCell<TermLineTable>[] = [
    {
        Id: 'TermName',
        numeric: false,
        disablePadding: true,
        label: 'Term', // the parent term this sub term belongs to
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
        label: 'Sub Term', // the sub term's own title (often empty, e.g. for brief definitions)
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