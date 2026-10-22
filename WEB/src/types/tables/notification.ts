import { Id } from "../utils"

export interface NotificationTable extends Id {
    UserId: number
    Description: string
    LinkedComponent: string
    Status: number
    DateCreated?: Date | string
    DateUpdated?: Date | string
}