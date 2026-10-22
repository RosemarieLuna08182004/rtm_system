
import {Icon as UIcon} from '@mdi/react';
import styled from 'styled-components';
import { colors } from '../../styles';
import { ToastType } from '../../types';

export const Container = styled.div<{ type: ToastType }>`
  background: ${({ type }) => {
    if (type === ToastType.success) {
      return colors.palette.green['400']
    }
    if (type === ToastType.warning) {
      return colors.palette.yellow['400']
    }
    return colors.palette.red['400']
  }};
  color: ${colors.primary};
  display: flex;
  padding: 12px;
`
export const Text = styled.span`
  align-items: center;
  color: #fff;
  display: flex;
`
export const Icon = styled(UIcon)`
color: #fff;
margin-right: 12px;
width: 30px;
height: 30px;`;