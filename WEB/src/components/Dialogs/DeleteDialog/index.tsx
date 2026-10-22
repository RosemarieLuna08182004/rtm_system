import { mdiAlertCircleOutline } from '@mdi/js';
import { DeleteDialogProps, DialogType, SFC } from '../../../types';
import { Modal } from '../..';
import * as S from './Styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

export const DeleteDialog: SFC<DeleteDialogProps> = ({
  ClassName,
  close,
  title,
  message,
  dialogType,
  recordId
}) => {

  const renderIcon = () => {
    if (dialogType === DialogType.delete) return <DeleteIcon className="md:text-white text-primary" />;
    return <CheckCircleIcon className="md:text-white text-primary" />;
  };

  const renderText = () => {
    if (dialogType === DialogType.delete) return 'Delete';
    return 'Confirm';
  };
  const removeRecord = async () => {
    alert(`bado ${recordId}`)
  }
  const footer = () => (
    <S.ConfirmationButtons>
      <button
        type="button"
        onClick={close}
        className="ease-in-out duration-300 mr-2 items-center text-primary rounded-lg h-10 flex justify-start items-center px-3 w-36 hover:bg-slate-200"
      >
        <CancelIcon className="text-primary" />
        <span className="font-sans ml-2">Cancel</span>
      </button>
      <button
        type="button"
        onClick={removeRecord}
        className="ease-in-out duration-300 bg-primary items-center text-white rounded-lg h-10 flex justify-start items-center px-3 w-36 hover:bg-sky-700"
      >
        {renderIcon()}
        <span className="font-sans ml-2">{renderText()}</span>
      </button>
    </S.ConfirmationButtons>
  );

  return (
    <Modal ClassName={ClassName} close={close} header={title} footer={footer()}>
      <S.MessageContainer>
        <S.Icon path={mdiAlertCircleOutline} size="28px" />
        <S.Message className="font-sans">{message}</S.Message>
      </S.MessageContainer>
    </Modal>
  );
};
