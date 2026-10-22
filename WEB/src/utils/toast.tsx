import { ReactNode } from 'react'
import { toast } from 'react-toastify'
import { Toast } from '../components'
import { ToastType } from '../types'
import { colors } from '../styles'

export const displayToast = (message: ReactNode, type: ToastType, className?: string): void => {
  toast(
    <Toast ClassName={className} type={type}>
      {message}
    </Toast>,
    {
      style:{
        background:(type === ToastType.error)?`${colors.palette.red['400']}`:`${colors.palette.green['400']}`,
        padding:'0px'
      },
      closeButton: false
    }
  )
}