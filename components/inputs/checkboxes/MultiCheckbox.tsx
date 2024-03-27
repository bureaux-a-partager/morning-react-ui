import { CSSProperties, useEffect, useState } from 'react';
import ParentInput from '@/components/inputs/ParentInput';
import { Size, sizeToGap } from '@/utils/Enum';
import {
  getSelectionStatus,
  setAllFalse,
  setAllTrue,
  updateSelectionState,
} from '@/utils/selectionStateUtils';
import { BasicInputProps, SelectionState, TriState } from '../types';
import Checkbox from './Checkbox';

type MultiCheckboxProps = BasicInputProps & {
  options: SelectionState;
  onChange: (options: SelectionState) => void;
  inline?: boolean;
  styleCheckbox?: CSSProperties;
  styleMultiCheckbox?: CSSProperties;
  hoveredIndex?: number | null;
  setHoveredIndex?: (index: number | null) => void;
  isSelectAll?: boolean;
  selectAllLabel?: string;
  disabled?: boolean;
  isError?: boolean;
};

const MultiCheckbox = ({
  options,
  onChange,
  size = Size.m,
  inline = false,
  label,
  sublabel,
  isLabelBold,
  styleCheckbox: styleCheckboxProps,
  styleMultiCheckbox: styleMultiCheckboxProps,
  hoveredIndex,
  setHoveredIndex,
  isSelectAll = false,
  selectAllLabel = 'Tout sélectionner',
  disabled = false,
  isError = false,
}: MultiCheckboxProps) => {
  const [selectAllCheckbox, setSelectAllCheckbox] = useState<TriState>(
    TriState.false,
  );

  const handleSelectAllChange = (value: TriState) => {
    if (value === TriState.true) onChange(setAllTrue(options));
    else if (value === TriState.false) onChange(setAllFalse(options));
  };

  useEffect(() => {
    setSelectAllCheckbox(getSelectionStatus(options));
  }, [options]);

  const styleMultiCheckbox: CSSProperties = {
    ...styleMultiCheckboxProps,
    display: 'flex',
    flexFlow: inline ? 'row wrap' : 'column',
    gap: sizeToGap(size),
  };

  const checkboxes = (
    <>
      {Object.entries(options).map(([key, value], index) => {
        const isHovered = index === hoveredIndex;
        const styleCheckbox = {
          ...styleCheckboxProps,
          ...(isHovered && { backgroundColor: 'var(--silver)' }),
        };
        const checkboxState = value ? TriState.true : TriState.false;

        const handleChange = (changedValue: TriState) => {
          if (changedValue === TriState.true)
            onChange(updateSelectionState(options, key, true));
          else onChange(updateSelectionState(options, key, false));
        };

        return (
          <Checkbox
            key={key}
            label={key}
            value={checkboxState}
            onChange={handleChange}
            size={size}
            style={styleCheckbox}
            onMouseEnter={() => setHoveredIndex?.(index)}
            onMouseLeave={() => setHoveredIndex?.(null)}
            disabled={disabled}
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
      style={styleMultiCheckbox}
      disabled={disabled}
    >
      {isSelectAll && (
        <Checkbox
          label={selectAllLabel}
          value={selectAllCheckbox}
          onChange={handleSelectAllChange}
          size={size}
          disabled={disabled}
          isError={isError}
        />
      )}
      {checkboxes}
    </ParentInput>
  );
};

export default MultiCheckbox;
