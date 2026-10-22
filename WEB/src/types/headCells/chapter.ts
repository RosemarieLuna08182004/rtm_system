import { HeadCell } from "../components";
import { ChapterTable } from "../tables";

export const chapterHC: HeadCell<ChapterTable>[] = [
    {
      Id: 'Title',
      numeric: false,
      disablePadding: true,
      label: 'Account Type',
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