import { ButtonType, SFC } from '../../../types';
import { ReactNode } from 'react';
import { Button } from '@mui/material';
import { colors } from '../../../styles';
import { twMerge } from 'tailwind-merge';
import { CircleButton } from '../CircleButton';

export interface ButtonProps {
  color?: string;
  dirty?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  text: string;
  type?: ButtonType;
  morph?: boolean
  child?:ReactNode
}

export const CustomButton: SFC<ButtonProps> = ({
  ClassName,
  color ='primary', 
  dirty = false,     
  disabled = false,
  icon,
  onClick,
  text,
  type = ButtonType.button, // Default button type
  morph = true,
  child
}) => {
  
  const CustomColor = () => {
    if (color === 'primary') return { bg: colors.primary, hover: colors.secondary, text: 'text-white' }
    if (color === 'green') return { bg: colors.palette.green['300'], hover: colors.palette.green['400'], text: 'text-white'}
    if (color === 'red') return { bg: colors.palette.red['300'], hover: colors.palette.red['400'], text: 'text-white'}
    if (color === 'default')  return { bg: 'none', hover: colors.palette.neutral['100'],text: 'text-primary' }
    return { bg: 'none', hover: colors.palette.neutral['100'],text: 'text-primary' }
  }

  return (
    <>
    <div className={morph?'md:block hidden':''}>
      <Button
        startIcon={icon}
        type={type}
        onClick={onClick}
        variant="contained"
        disabled={disabled || dirty}
        className={twMerge(" flex items-center justify-center h-10 rounded-md shadow-none " + ClassName)}
        sx={{
          minWidth:'120px',
          border:'none',
          background: CustomColor().bg,
          '&:hover': { background: CustomColor().hover },
          opacity: disabled || dirty ? 0.6 : 1, // Lower opacity if disabled or dirty
          cursor: disabled || dirty ? 'not-allowed' : 'pointer', // Cursor style
        }}
      >
        {child}
        <span className={`font-sans ${CustomColor().text}`}>{text}</span>
      </Button>
    </div>
    { morph && <div className='md:hidden block'>
      <CircleButton OnClick={onClick} IsNotification={false} Icon={icon} Type={type} ClassName={disabled?'hidden':'block'} Disabled={disabled}/>
    </div> }
    </>
  );
};
