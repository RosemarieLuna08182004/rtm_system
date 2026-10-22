import { mdiAlertCircleOutline } from '@mdi/js'
import { NoRecordProps, SFC } from '../../../../types'
import * as S from './Styles'
import { twMerge } from 'tailwind-merge'

export const NoRecord: SFC<NoRecordProps> = ({ ClassName, Message, TextStyle, IconStyle}) => {
  return (
    <>
      <S.Container className={twMerge('w-full ', ClassName)}>
        <S.MessageContainer className={IconStyle}>
          <S.Icon path={mdiAlertCircleOutline}/>
          <S.Message className={TextStyle}>{Message}</S.Message>
        </S.MessageContainer>
      </S.Container>
    </>
  )
}
