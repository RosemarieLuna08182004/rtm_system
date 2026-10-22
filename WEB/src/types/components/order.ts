export interface OrderReceiptProps {
    SchoolName: string;
    SchoolAddress: string;
    TIN?: string;
    PTU?: string;
    SerialNumber?: string;
    MachineNumber?: string;
    SalesNumber: string;
    SalesDate: string;
    Items: Array<any>;
    PayType: string;
    PaidAmount: number;
    ApprovedBy: string;
}