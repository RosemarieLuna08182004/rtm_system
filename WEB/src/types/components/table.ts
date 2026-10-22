import { DBTable } from "../channels"

export type Order = 'asc' | 'desc'

export interface HeadCell<T> {
    Id: keyof T
    disablePadding: boolean
    label: string
    numeric: boolean
  }

export interface EnhancedTableProps<T extends Record<string, any>> {
    Rows: T[]
    HeadCells: HeadCell<T>[]
    ClassName?: string
    IsEdit?: boolean
    OnRecordDelete: () => void;
    Title?:string
    RemoveTable?: DBTable
    IsRemove?:boolean
    IsLoading?:boolean
}