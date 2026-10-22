import { SFC } from '../../types';
import { Modal, SubTermForm } from '../../components';
import * as S from '../../styles';
import { twMerge } from 'tailwind-merge';

interface SubTermModalProps {
  close(): void;
  title: string;
}

const filterProps = (props: any) => {
  const { close, confirm, title, ...domProps } = props;
  return domProps;
};

export const SubTermModal: SFC<SubTermModalProps> = ({ ClassName, title, close}) => {
  return (
    <Modal className={twMerge('' + ClassName)} header={title} close={close} isPopUp={true} {...filterProps({ ClassName, title, confirm })} disableOverlayClick={false} >
        <S.Container className="w-full">
          <SubTermForm Title={''} IsDetails={false} IsId={true}/>
        </S.Container>
    </Modal>
  );
};
