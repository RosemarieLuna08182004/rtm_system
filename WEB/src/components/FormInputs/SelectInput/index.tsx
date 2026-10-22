import { twMerge } from 'tailwind-merge';
import { SFC } from '../../../types';
import * as S from './Styles';
import { colors } from '../../../styles';

export interface SelectInputProps {
  errors: { [field: string]: string };
  label: string;
  name: string;
  placeholder?: string;
  touched: { [field: string]: boolean };
  value?: string;
  options: Array<{ value: string; label: string }>;
  disabled?:boolean
}

export const SelectInput: SFC<SelectInputProps> = ({
  ClassName,
  errors,
  label,
  name,
  placeholder = 'Select an option',
  touched,
  options,
  value,
  disabled = false
}) => {
  const style = {
    border:disabled?`1px solid ${colors.palette.neutral['100']}`:'',
    backgroundColor: disabled?`white`:'',
  }
  return (
    <>
      <S.Label htmlFor={name} className="text-zinc-700">{label}</S.Label>
      <S.Field name={name} className={twMerge(' border ', ClassName)}>
        {({ field, form }: any) => (
          <>
            <S.Field
              disabled={disabled}
              style={style}
              {...field}
              as="select"
              value={value ?? field.value} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                form.setFieldValue(name, e.target.value); 
              }}
              $error={errors[name] && touched[name]}
            >
              {/* Placeholder option */}
              <option value="" disabled>
                {placeholder}
              </option>
              {/* Options */}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Field>
            <S.SecondaryContainer>
              {errors[name] && touched[name] ? (
                <S.ErrorMessage>{errors[name]}</S.ErrorMessage>
              ) : null}
            </S.SecondaryContainer>
          </>
        )}
      </S.Field>
    </>
  );
};
