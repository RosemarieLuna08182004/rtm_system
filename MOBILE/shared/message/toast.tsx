import { ToastType } from '@/types';
import React from 'react';
import ToastManager, { Toast } from 'toastify-react-native';
import { ToastManagerProps } from 'toastify-react-native/utils/interfaces';

const ToasterManager = (props: Partial<ToastManagerProps>) => (
  <ToastManager
    position="top"
    duration={2000}
    showCloseIcon={true}
    animationIn="slideInRight"
    animationOut="slideOutLeft"
    showProgressBar={true}
    style={{ maxWidth:350, height:"auto"}}
    {...props}
  />
);

export const showMessage = (
  content: string,
  type: ToastType,
) => Toast[type](content);

export { ToasterManager };
