import { mdiAlertCircleOutline } from '@mdi/js';
import { ButtonType, ConfirmationDialogProps, DialogType, SFC } from '../../../types';
import { Modal } from '../..';
import * as S from './Styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../../../styles';
import { CustomButton } from '../..';

const filterProps = (props: any) => {
  const { close, confirm, title, message, dialogType, ...domProps } = props;
  return domProps;
};

export const ConfirmationDialog: SFC<ConfirmationDialogProps> = ({
  ClassName, close, title, message, confirm,  dialogType}) => {
  const renderIcon = () => {
    if (dialogType === DialogType.delete) return <DeleteIcon className="md:text-white text-primary" />;
    return <CheckCircleIcon className="md:text-white text-primary" />;
  };

  const renderText = () => {
    if (dialogType === DialogType.delete) return 'Delete';
    return 'Confirm';
  };

  const footer = () => (
    <>
      <S.ConfirmationButtons>
        <div className='mr-2'>
          <CustomButton 
            color={`${colors.palette.neutral['100']}`}
            icon={<CancelIcon className="text-primary" />}
            onClick={close}
            text={'Cancel'} 
            type={ButtonType.button}
          />
        </div>
          <CustomButton 
            icon={renderIcon()}
            onClick={confirm}
            text={renderText()} 
            type={ButtonType.button}
          />
      </S.ConfirmationButtons>
    </>
  );

  return (
    <Modal className={ClassName} close={close} header={title} footer={footer()} {...filterProps({ ClassName, close, title, message, confirm, dialogType })}>
      <S.MessageContainer>
        <S.Icon path={mdiAlertCircleOutline} size="28px" />
        <S.Message className="font-sans">{message}</S.Message>
      </S.MessageContainer>
    </Modal>
  );
};
