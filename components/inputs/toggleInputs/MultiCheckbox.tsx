import {
  createRef,
  CSSProperties,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import useIsMobile from 'morning-react-ui/components/hooks/useIsMobile';
import ParentInput from 'morning-react-ui/components/inputs/ParentInput';
import { SelectionState, TriState } from 'morning-react-ui/types/dataTypes';
import { Size } from 'morning-react-ui/utils/Enum';
import { getSelectionStatus } from 'morning-react-ui/utils/selectionState/selectionStateInfo';
import {
  setAllFalse,
  setAllTrue,
  updateSelectionState,
} from 'morning-react-ui/utils/selectionState/selectionStateModifiers';
import { BasicInputProps } from '../propsTypes';
import styles from './multiToggleInputs.module.css';
import Checkbox from './single/Checkbox';

type MultiCheckboxProps = BasicInputProps & {
  options: SelectionState;
  onChange: (options: SelectionState) => void;
  checkboxRefs?: RefObject<HTMLInputElement>[];
  setCheckboxRefs?: Dispatch<SetStateAction<RefObject<HTMLInputElement>[]>>;
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
  checkboxRefs,
  setCheckboxRefs,
  size,
  inline = false,
  label,
  sublabel,
  bold,
  styleCheckbox: styleCheckboxProps,
  styleMultiCheckbox,
  hoveredIndex,
  setHoveredIndex,
  isSelectAll = false,
  selectAllLabel = 'Tout sélectionner',
  disabled = false,
  isError = false,
}: MultiCheckboxProps) => {
  const isMobile = useIsMobile();
  const finalSize = size ?? (isMobile ? Size.l : Size.m);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState<TriState>(
    TriState.false,
  );

  const handleSelectAllChange = (value: TriState) => {
    if (value === TriState.true) {
      onChange(setAllTrue(options));
    } else if (value === TriState.false) {
      onChange(setAllFalse(options));
    }
  };

  useEffect(() => {
    setSelectAllCheckbox(getSelectionStatus(options));
  }, [options]);

  const styleSelectAll = {
    ...styleCheckboxProps,
    ...(hoveredIndex === 0 && { backgroundColor: 'var(--cloud)' }),
  };

  useEffect(() => {
    if (!setCheckboxRefs) return;
    const requiredRefsCount =
      Object.keys(options).length + (isSelectAll ? 1 : 0);

    setCheckboxRefs((prevRefs) => {
      const newRefs = Array(requiredRefsCount)
        .fill(null)
        .map((_, index) => prevRefs[index] || createRef<HTMLInputElement>());
      return newRefs;
    });
  }, [options, isSelectAll, setCheckboxRefs]);

  const checkboxes = (
    <>
      {Object.entries(options).map(([key, value], index) => {
        const adjustedIndex = isSelectAll ? index + 1 : index;
        const isHovered = adjustedIndex === hoveredIndex;
        const checkboxState = value ? TriState.true : TriState.false;

        const handleChange = (changedValue: TriState) => {
          if (changedValue === TriState.true) {
            onChange(updateSelectionState(options, key, true));
          } else {
            onChange(updateSelectionState(options, key, false));
          }
        };

        return (
          <Checkbox
            key={key}
            label={key}
            className={classNames({ [styles.checkboxHovered]: isHovered })}
            value={checkboxState}
            onChange={handleChange}
            size={size}
            style={styleCheckboxProps}
            disabled={disabled}
            isError={isError}
            onMouseMove={() => {
              if (setHoveredIndex) {
                setHoveredIndex(adjustedIndex);
              }
            }}
            onMouseLeave={() => {
              if (setHoveredIndex) {
                setHoveredIndex(null);
              }
            }}
            ref={checkboxRefs ? checkboxRefs[index + +isSelectAll] : undefined}
          />
        );
      })}
    </>
  );

  return (
    <ParentInput
      label={label}
      sublabel={sublabel}
      size={finalSize}
      bold={bold}
      disabled={disabled}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.inline]: inline,
          [styles.column]: !inline,
        })}
        style={styleMultiCheckbox}
      >
        {isSelectAll && (
          <Checkbox
            label={selectAllLabel}
            value={selectAllCheckbox}
            onChange={handleSelectAllChange}
            style={styleSelectAll}
            size={size}
            disabled={disabled}
            isError={isError}
            onMouseMove={() => {
              if (setHoveredIndex) {
                setHoveredIndex(0);
              }
            }}
            ref={checkboxRefs ? checkboxRefs[0] : undefined}
            onMouseLeave={() => {
              if (setHoveredIndex) {
                setHoveredIndex(null);
              }
            }}
            className={'font-weight-medium'}
          />
        )}
        {checkboxes}
      </div>
    </ParentInput>
  );
};

export default MultiCheckbox;
