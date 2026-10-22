import { HeadCell } from "../components";
import { UserTable } from "../tables";

export const userHC: HeadCell<UserTable>[] = [
    {
      Id: 'AccountType',
      numeric: false,
      disablePadding: true,
      label: 'Account Type',
    },
    {
      Id: 'Name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
    },
    {
      Id: 'Email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
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