import { colors } from '../../../styles'
import { Field as UField } from 'formik'
import styled from 'styled-components'

export const Container = styled.div`
`
export const ErrorMessage = styled.div`
  color: ${colors.palette.red['500']};
  font-size: 10px;
`

export const Field = styled(UField)`
  color:${colors.palette.neutral['700']};
  ${({ $disabled }) => ($disabled ? `background-color:white; border:1px solid ${colors.palette.neutral['100']}`: `background-color: ${colors.palette.neutral['075']};` )};
  border-radius: 3px;
  ${({ $error }) => ($error ? `border:1px solid ${colors.palette.red['500']}` : 'none')};
  display: block;
  min-height: 40px;
  padding: 10px 14px;
  width: 100%;
  outline:none;
  transition: all 0.3s
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }


  &:focus {
    border-bottom:1.5px solid ${colors.primary};
  }
   
`
export const Label = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
`
export const SecondaryContainer = styled.div`
  margin-bottom: 8px;
`