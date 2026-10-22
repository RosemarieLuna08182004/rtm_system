import { ReactNode } from "react"
import { GenericFunction } from "../utils"

export enum ButtonType {
  button = 'button',
  submit = 'submit',
}

export enum ButtonColor {
  default='default',
  primary = 'primary',
  blue = 'blue',
  gray = 'gray',
  red = 'red',
  green = 'green'
}

export interface CircleButtonProps {
  OnClick : any | GenericFunction
  IsNotification?: boolean
  Icon: ReactNode
  Type:ButtonType
  Color?:ButtonColor
  Title?:string
  Disabled?:boolean
}
