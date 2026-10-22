import { GenericFunction } from "../utils";

export interface ModalComponentProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  onLeftButtonPress?: GenericFunction;
  onRightButtonPress?: () => void;
}