import { Icon as UIcon } from '@mdi/react'
import { colors } from '../../styles'
import styled from 'styled-components'

export const ConfirmationButtons = styled.div`
  border-top: 1px solid ${colors.palette.neutral['200']};
  display:flex;
  justify-content:end;
  padding: 10px 10px;
`
export const MessageContainer = styled.div`
  width:100%;
  padding:10px 10px;
  align-items: center;
  display:flex;
  justify-content:center;
`
export const Message = styled.div`
  align-items: center;
  display:flex;
  margin-left:10px;
  font-size:16px;
  color: ${colors.palette.neutral['600']};
`
export const Icon = styled(UIcon)`
 color: ${colors.palette.neutral['600']};
`