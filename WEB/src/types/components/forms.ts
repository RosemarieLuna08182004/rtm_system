export interface NewForm {
    title: string
    path?: string
}

export interface FormProps {
    Title : string
    /** Short italic line under the title saying what the form is for */
    Description?: string
    IsEdit?: boolean
    /** Permanently read-only (no Save button), unlike IsEdit which locks the form until Edit is clicked */
    ViewOnly?: boolean
    /** Called after an existing record is saved, e.g. to switch the page back to its preview */
    OnSaved?: () => void
    IsDisplay?: boolean
    IsDetails?: boolean
    IsId?:boolean
}