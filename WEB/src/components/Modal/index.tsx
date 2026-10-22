import { mdiClose } from '@mdi/js';
import { createPortal } from 'react-dom';
import { ModalProps, SFC } from '../../types';
import { Icon } from '../Icon';
import * as S from './Styles';

export const Modal: SFC<ModalProps> = ({
  children,
  ClassName,
  close,
  disableOverlayClick = false,
  footer,
  header,
  isPopUp = true
}) => {
  const renderCloseBtn = () => {
    return isPopUp? <Icon icon={mdiClose} onClick={close} size={16} role="button"  aria-label="Close modal" /> : null
  }
  return createPortal(
    <>
      <S.Overlay
        className=' z-0 '
        onClick={disableOverlayClick ? undefined : close}
        aria-hidden="true"
      />
      <S.Modal className={ClassName} role="dialog" aria-modal="true" aria-labelledby="modal-header">
        <S.Header id="modal-header">
          <span>{header}</span>
          {renderCloseBtn()}
        </S.Header>
        <S.Content>{children}</S.Content>
        {footer && <>{footer}</>}
      </S.Modal>
    </>,
    document.getElementById('modal-root')!
  );
};
