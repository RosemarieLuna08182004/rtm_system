import UIcon from '@mdi/react'
import { colors } from '../../../../styles'
import styled from 'styled-components'
export const Container = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    width:100%:
    height:fit;
    position: relative;
`
export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const Message = styled.span`
  color: ${colors.palette.neutral['200']};
`
export const Icon = styled(UIcon)`
  width: 75px;
  height: 75px;
  color: ${colors.palette.neutral['100']};
`
