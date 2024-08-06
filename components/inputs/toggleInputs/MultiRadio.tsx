import React from 'react';
import classNames from 'classnames';
import ParentInput from 'morning-react-ui/components/inputs/ParentInput';
import { SelectionState } from 'morning-react-ui/types/dataTypes';
import { Size } from 'morning-react-ui/utils/Enum';
import { setAtTrueAndOthersAtFalse } from 'morning-react-ui/utils/selectionState/selectionStateModifiers';
import { BasicInputProps } from '../propsTypes';
import styles from './multiToggleInputs.module.css';
import Radio from './single/Radio';

type MultiRadioProps = BasicInputProps & {
  options: SelectionState;
  onChange: (options: SelectionState) => void;
  inline?: boolean;
  isError?: boolean;
};

const MultiRadio = ({
  options,
  onChange,
  size = Size.m,
  label,
  sublabel,
  isLabelBold,
  disabled = false,
  inline = true,
  isError = false,
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
            isError={isError}
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
      <div
        className={classNames(styles.wrapper, {
          [styles.inline]: inline,
          [styles.column]: !inline,
        })}
      >
        {radios}
      </div>
    </ParentInput>
  );
};

export default MultiRadio;
