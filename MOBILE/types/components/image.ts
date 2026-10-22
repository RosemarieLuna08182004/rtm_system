export interface ProfilePictureProps {
  imageUri: string;
  size?: number;
  onPress?: () => void;
  showEditButton?: boolean;
  borderWidth?: number;
  borderColor?: string;
  className?: string;
  imageClassName?: string;
}
