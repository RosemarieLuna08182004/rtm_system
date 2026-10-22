import { ReactNode, useCallback } from 'react';
import { SFC, ToastType } from '../../types';
import * as S from './Styles';
import { mdiAlertCircleOutline, mdiCheckCircle } from '@mdi/js';

export interface ToastProps {
  children: ReactNode;
  type?: ToastType; // Made optional since there's a default
}

export const Toast: SFC<ToastProps> = ({ children, ClassName, type = ToastType.error }) => {
  const renderIcon = useCallback((): ReactNode => {
    switch (type) {
      case ToastType.success:
        return <S.Icon path={mdiCheckCircle} aria-label="Success" />;
      default:
        return <S.Icon path={mdiAlertCircleOutline} aria-label="Error" />;
    }
  }, [type]);

  return (
    <S.Container className={ClassName} type={type}>
      {renderIcon()}
      <S.Text>{children}</S.Text>
    </S.Container>
  );
};
