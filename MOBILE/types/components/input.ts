import { GenericFunction } from "../utils"
import { KeyboardTypeOptions, ReturnKeyTypeOptions, TextInputProps } from "react-native"

export interface InputProps {
    Text:string
    Value: any
    OnChange: GenericFunction
    Placeholder?:string
    OnBlur?:GenericFunction
    Errors?:string
    KeyboardType?: KeyboardTypeOptions
    AutoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    AutoCorrect?: boolean
    AutoComplete?: TextInputProps['autoComplete']
    TextContentType?: TextInputProps['textContentType']
    ReturnKeyType?: ReturnKeyTypeOptions
}