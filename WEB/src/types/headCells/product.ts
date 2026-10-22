import { HeadCell } from "../components";
import { ProductTable } from "../tables";

export const productHC: HeadCell<ProductTable>[] = [
    {
        Id: 'Name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        Id: 'Coins',
        numeric: false,
        disablePadding: true,
        label: 'Coins',
    },
    {
        Id: 'Price',
        numeric: true,
        disablePadding: false,
        label: 'Price',
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