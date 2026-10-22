import { mdiAlertCircleOutline } from '@mdi/js';
import { ButtonType, SFC } from '../../types';
import { CustomButton, Modal } from '../../components';
import * as S from './Styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { twMerge } from 'tailwind-merge';

interface SessionExpiredModalProps {
  confirm(): void;
  close(): void;
  title: string;
}

const filterProps = (props: any) => {
  const { close, confirm, title, ...domProps } = props;
  return domProps;
};

export const SessionExpiredModal: SFC<SessionExpiredModalProps> = ({ ClassName, title, close, confirm}) => {
  const footer = () => (
    <>
      <div className='w-full flex justify-end items-center p-2'>
        <CustomButton icon={<CheckCircleIcon className="md:text-white text-primary" />} text='Confirm' onClick={confirm} type={ButtonType.button}/>
      </div>
    </>
  );
  return (
    <Modal className={twMerge('' + ClassName)} header={title} close={close} footer={footer()} isPopUp={false} {...filterProps({ ClassName, title, confirm })} disableOverlayClick={true} >
      <S.MessageContainer className='w-full'>
        <S.Icon path={mdiAlertCircleOutline} size="28px" />
        <S.Message className="font-sans">Session has expired.</S.Message>
      </S.MessageContainer>
    </Modal>
  );
};
