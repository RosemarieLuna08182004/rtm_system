import { GenericFunction } from "../utils";

export enum DialogType {
    delete = 'delete-dialog',
    confirm = 'confirm-dialog'
}

export interface DeleteDialogProps {
    close(): void;
    title: string;
    message: string;
    dialogType?: DialogType;
    recordId?: number
  }
  
export interface ConfirmationDialogProps {
    close(): void;
    confirm(): any | GenericFunction;
    title: string;
    message: string;
    dialogType?: DialogType;
}