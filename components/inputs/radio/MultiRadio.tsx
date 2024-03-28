import React from 'react';
import ParentInput from '@/components/inputs/ParentInput';
import { Size } from '@/utils/Enum';
import { setAtTrueAndOthersAtFalse } from '@/utils/selectionStateUtils';
import { BasicInputProps, SelectionState } from '../types';
import Radio from './Radio';

type MultiRadioProps = BasicInputProps & {
  options: SelectionState;
  onChange: (options: SelectionState) => void;
  inline?: boolean;
};

const MultiRadio = ({
  options,
  onChange,
  size = Size.m,
  label,
  sublabel,
  isLabelBold,
  disabled = false,
}: MultiRadioProps) => {
  const radios = (
    <>
      {Object.entries(options).map(([key, value]) => {
        const handleChange = (changedValue: boolean) => {
          if (!changedValue) {
            onChange(setAtTrueAndOthersAtFalse(options, key));
          }
        };

        return (
          <Radio
            key={key}
            label={key}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            size={size}
          />
        );
      })}
    </>
  );

  return (
    <ParentInput
      label={label}
      sublabel={sublabel}
      size={size}
      isLabelBold={isLabelBold}
      disabled={disabled}
    >
      {radios}
    </ParentInput>
  );
};

export default MultiRadio;
