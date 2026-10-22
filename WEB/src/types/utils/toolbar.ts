import { ReactNode } from "react"
import { HeadCell, Order } from "../components"

export interface TableToolbarProps {
    Title: string
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