import { SFC } from '../../../types'
import * as S from './Styles'

export interface InputProps {
  errors: { [field: string]: string }
  label: string
  name: string
  touched: { [field: string]: boolean }
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  placeholder?:string
}

export const Input: SFC<InputProps> = ({
  ClassName,
  disabled,
  errors,
  label,
  name,
  touched,
  type = 'text',
  value,
  onChange,
  placeholder
}) => {
  return (
    <>
      <S.Container>
        <S.Label className="text-zinc-700"> {label}</S.Label>
        <S.Field
          disabled={disabled}
          $disabled={disabled}
          $error={errors[name] && touched[name]}
          className={ClassName}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <S.SecondaryContainer>
          {errors[name] && touched[name] ? <S.ErrorMessage className="text-red-300">{errors[name]}</S.ErrorMessage> : null}
        </S.SecondaryContainer>
      </S.Container>
    </>
  )
}
