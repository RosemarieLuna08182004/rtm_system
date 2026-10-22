import { HeadCell } from "../components";
import { NotificationTable } from "../tables";

export const notificationHC: HeadCell<NotificationTable>[] = [
    {
      Id: 'Description',
      numeric: false,   
      disablePadding: true,
      label: 'Description',
    },
    {
      Id: 'Status',
      numeric: false,
      disablePadding: false,
      label: 'Status',
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
    }
  ];
