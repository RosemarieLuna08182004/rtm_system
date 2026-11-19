import { GenericFunction } from "../utils";

export interface AnimatedSearchProps {
  duration: number;
  value: string;
  onChangeText: (text: string) => void;
  expanded: boolean;
  setExpanded: GenericFunction;
  alwaysExpanded?: boolean;
}