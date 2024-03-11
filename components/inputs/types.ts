import { Size } from '@/utils/Enum';

export type BasicInputProps = {
  label?: string;
  sublabel?: string;
  size?: Size;
  isLabelBold?: boolean;
  disabled?: boolean;
};

export type InputProps = BasicInputProps & {
  isRequired?: boolean;
  isError?: boolean;
  placeholder?: string;
};

export const enum TriState {
  true = 'true',
  false = 'false',
  indeterminate = 'indeterminate',
}

export type SelectionState = {
  [key: string]: boolean;
};
