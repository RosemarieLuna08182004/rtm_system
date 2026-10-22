import { ReactNode } from "react";

export interface Modal {
    close(): void
    handleRecordOnSave: any
}


export interface ModalProps {
    children: ReactNode;
    close(): void;
    disableOverlayClick?: boolean;
    footer?: ReactNode;
    header: string;
    isPopUp?:boolean
  }