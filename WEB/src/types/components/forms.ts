export interface NewForm {
    title: string
    path?: string
}

export interface FormProps {
    Title : string
    IsEdit?: boolean
    IsDisplay?: boolean
    IsDetails?: boolean
    IsId?:boolean
}