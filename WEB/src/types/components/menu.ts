export interface MenuProps {
    icon: string
    label: string
    onClick?: any
    /** Route this item points to. Used to highlight the item when the current page is under it. */
    to?: string
}

export interface MenuSectionProps {
    label: string
}