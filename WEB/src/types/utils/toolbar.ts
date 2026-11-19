import { ReactNode } from "react"
import { HeadCell, Order } from "../components"

export interface TableToolbarProps {
    Title: string
    /** Short italic line saying what the list is for */
    Description?: string
    /** Records shown (after search); hidden while undefined */
    Count?: number
    /** All records, shown as "Count of Total" while a search narrows the list */
    Total?: number
    children: ReactNode
}

export interface TableHeaderProps<T> {
    numSelected?: number
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void
    onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: keyof T
    rowCount?: number
    headCells: HeadCell<T>[]
}

export interface NoRecordProps {
    Message: string
    TextStyle?:string
    IconStyle?:string
}