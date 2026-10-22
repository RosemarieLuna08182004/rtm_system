export interface Order {
    name:string
    quantity: number
    total: number
  }
  
export interface OrderConfirmationModalProps {
    confirm(): void;
    close(): void;
    title: string;
    order: Order
}