import { HeadCell } from "../components";
import { CategoryTable } from "../tables";

export const categoryHC: HeadCell<CategoryTable>[] = [
    {
      Id: 'Category',
      numeric: false,
      disablePadding: true,
      label: 'Category',
    },
    {
        Id: 'Description',
        numeric: false,
        disablePadding: true,
        label: 'Description',
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