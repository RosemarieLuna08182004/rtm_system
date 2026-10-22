import { RefObject } from "react";
import ReactQuill from "react-quill";
import { GenericFunction } from "../utils";

export interface TextEditorProps {
    ref: RefObject<ReactQuill>;
    value: string; 
    onChange: GenericFunction
    isEdit?: boolean
  }
  