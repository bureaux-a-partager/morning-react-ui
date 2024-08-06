import classNames from 'classnames';
import TextInput from 'morning-react-ui/components/inputs/textField/TextInput';
import MultiCheckbox from 'morning-react-ui/components/inputs/toggleInputs/MultiCheckbox';
import { SelectionState } from 'morning-react-ui/types/dataTypes';
import { Size } from 'morning-react-ui/utils/Enum';
import { atLeastOneTrue } from 'morning-react-ui/utils/selectionState/selectionStateInfo';
import { setAllFalse } from 'morning-react-ui/utils/selectionState/selectionStateModifiers';
import { SelectsProps } from '../propsTypes';
import useMultiSelect from './hooks/useMultiSelect';
import styles from './selects.module.css';

type MultiSelectProps = SelectsProps & {
  options: SelectionState;
  onChange: (newSelection: SelectionState) => void;
};

const MultiSelect = ({
  label,
  sublabel,
  isLabelBold,
  size = Size.m,
  disabled = false,
  options,
  onChange,
  isError,
  placeholder = 'MultiSelect',
  rowToDisplay = 8,
  emptyStateText = 'Aucun résultat dans la liste',
}: MultiSelectProps) => {
  const {
    keyboardNavigation,
    wrapperRef,
    checkboxRefs,
    setCheckboxRefs,
    inputRef,
    inputValue,
    handleTextChange,
    isDropdownDisplayed,
    setCursorPosition,
    adjustCursorPosition,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    displaySelectAll,
    makeHighlightedIndexSelected,
    handleDropdownMouseDown,
    maxHeight,
    handleFocus,
  } = useMultiSelect({ options, onChange, size, rowToDisplay });

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <TextInput
        ref={inputRef}
        className={classNames(styles.textOverflowEllipsis, {
          [styles.focusedColor]: isDropdownDisplayed,
          [styles.oneTrueAndBlur]:
            atLeastOneTrue(options) && !isDropdownDisplayed,
          [styles.focus]: isDropdownDisplayed,
        })}
        placeholder={placeholder}
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        value={inputValue}
        onChange={handleTextChange}
        onFocus={() => handleFocus()}
        onKeyDown={(e) => keyboardNavigation(e)}
        showClearButton={atLeastOneTrue(options)}
        showDropdownIcon
        isDropdownActive={isDropdownDisplayed}
        onClear={() => onChange(setAllFalse(options))}
        onCursorPositionChange={(position) => {
          setCursorPosition(position);
        }}
        setCursorPosition={adjustCursorPosition}
        isError={isError}
        disabled={disabled}
      />
      {isDropdownDisplayed && (
        <div
          className={styles.dropdown}
          style={{
            maxHeight: `${maxHeight}px`,
          }}
          onKeyDown={(e) => keyboardNavigation(e)}
          onMouseDown={handleDropdownMouseDown}
          onClick={makeHighlightedIndexSelected}
          tabIndex={-1}
        >
          {Object.keys(filteredOptions).length > 0 ? (
            <MultiCheckbox
              options={filteredOptions}
              size={size}
              onChange={(optionsToChange) => {
                onChange({ ...options, ...optionsToChange });
              }}
              styleCheckbox={{ padding: '6px 10px', cursor: 'pointer' }}
              hoveredIndex={highlightedIndex}
              setHoveredIndex={setHighlightedIndex}
              isSelectAll={displaySelectAll}
              checkboxRefs={checkboxRefs}
              setCheckboxRefs={setCheckboxRefs}
            />
          ) : (
            <span
              className={classNames(
                styles.option,
                `font-size-${size}`,
                `padding-${size}`,
                styles.emptyState,
              )}
            >
              {emptyStateText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
