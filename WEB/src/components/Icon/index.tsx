import MdiIcon from '@mdi/react'
import { forwardRef, HTMLAttributes, useMemo } from 'react'

import * as S from './Styles'

export interface IconProps extends HTMLAttributes<HTMLDivElement> {
  ClassName?: string
  dataTestId?: string
  disabled?: boolean
  icon: string
  onClick?(e?: React.MouseEvent<HTMLDivElement, MouseEvent>): void
  onKeyDown?(e?: React.KeyboardEvent<HTMLDivElement>): void
  size?: number
  totalSize?: number | 'unset'
  $unfocusable?: boolean
}

export const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      ClassName,
      dataTestId,
      disabled = false,
      icon,
      onClick,
      onKeyDown,
      size = 24,
      totalSize,
      $unfocusable = false
    },
    ref
  ) => {
    const handleClick = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      if (disabled || !onClick) return
      onClick(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (!onClick) return
      if (e.key === 'Enter' && !disabled) handleClick()
      onKeyDown?.(e)
    }

    const tabIndex = useMemo(
      () => ($unfocusable || disabled || !onClick ? undefined : 0),
      [disabled, onClick, $unfocusable]
    )

    const hasOnClickHandler = !!onClick

    return (
      <S.Wrapper
        className={ClassName}
        data-testid={dataTestId || 'Icon'}
        $disabled={disabled}
        $hasOnClickHandler={hasOnClickHandler}
        $unfocusable={$unfocusable}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref}
        role={onClick ? 'button' : 'img'}
        $size={size}
        tabIndex={tabIndex}
        $totalSize={totalSize}
      >
        <MdiIcon path={icon} size={`${size}px`} />
      </S.Wrapper>
    )
  }
)