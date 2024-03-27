import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Size } from '@/utils/Enum';
import {
  getCurrentElementFromCursorPosition,
  getElementPositionInSelectionState,
  selectionStateTrueToString,
  setAllFalse,
  stateToValidatedState,
  toggleSelectionStateAtIndex,
  updateSelectionState,
} from '@/utils/selectionStateUtils';
import TextInput from '../textField/TextInput';
import MultiCheckbox from '../checkboxes/MultiCheckbox';
import styles from './selects.module.css';
import { SelectionState } from '../types';

type MultiSelectProps = {
  label?: string;
  sublabel?: string;
  isLabelBold?: boolean;
  size?: Size;
  options: SelectionState;
  onChange: (newSelection: SelectionState) => void;
  placeholder?: string;
};

const MultiSelect = ({
  label,
  sublabel,
  isLabelBold,
  size = Size.m,
  options,
  onChange,
  placeholder = 'MultiSelect',
}: MultiSelectProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] =
    useState<SelectionState>(options);
  const [validatedOptions, setValidatedOptions] = useState<
    SelectionState | undefined
  >();
  const [validatedOptionsString, setValidatedOptionsString] = useState('');
  const [isDropdownDisplayed, setIsDropdownDisplayed] =
    useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue: string = e.target.value;
    setInputValue(newValue);
  };

  const handleMultiCheckboxChange = (optionsToChange: SelectionState) => {
    setFilteredOptions(optionsToChange);
    onChange({ ...options, ...optionsToChange });
  };

  const filterSelectionStateByKey = (value: string): SelectionState => {
    const inputValueLower = value.toLowerCase();
    return Object.keys(options)
      .filter((key) => key.toLowerCase().includes(inputValueLower))
      .reduce((acc: SelectionState, key) => {
        acc[key] = options[key];
        return acc;
      }, {});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownDisplayed(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(
      filterSelectionStateByKey(inputValue.replace(validatedOptionsString, '')),
    );
  }, [inputValue]);

  useEffect(() => {
    if (!isDropdownDisplayed) setHighlightedIndex(null);
    else setHighlightedIndex(0);
  }, [isDropdownDisplayed]);

  const adjustCursorPosition = useCallback(() => {
    const input = inputRef.current;
    if (input && cursorPosition !== null) {
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  const handleTabOrArrowDown = () => {
    if (highlightedIndex === null) setHighlightedIndex(0);
    else {
      const newIndex =
        (highlightedIndex + 1) % Object.keys(filteredOptions).length;
      setHighlightedIndex(newIndex);
    }
  };

  const handleArrowUp = () => {
    if (highlightedIndex === null) return;
    const newIndex =
      (highlightedIndex - 1 + Object.keys(filteredOptions).length) %
      Object.keys(filteredOptions).length;
    setHighlightedIndex(newIndex);
  };

  const handleEnter = () => {
    if (highlightedIndex === null) return;
    const optionKeys = Object.keys(filteredOptions);
    const selectedKey = optionKeys[highlightedIndex];
    if (!selectedKey) return;
    const newValue = !filteredOptions[selectedKey];
    const oneSelectionState: SelectionState = {
      [selectedKey]: newValue,
    };
    onChange({ ...options, ...oneSelectionState });
  };

  const handleArrowLeft = () => {
    if (!inputRef.current) return;
    if (
      validatedOptions &&
      cursorPosition &&
      validatedOptionsString.length >= cursorPosition
    ) {
      const currentElementKey = getCurrentElementFromCursorPosition(
        validatedOptions,
        cursorPosition,
      );
      if (currentElementKey) {
        const newCursorPosition = getElementPositionInSelectionState(
          validatedOptions,
          currentElementKey,
        )?.start;
        if (newCursorPosition !== undefined) {
          setCursorPosition(newCursorPosition);
        }
      }
    } else if (cursorPosition) {
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleArrowRight = () => {
    if (cursorPosition === null || !inputRef.current) return;
    if (
      validatedOptions &&
      cursorPosition !== undefined &&
      validatedOptionsString.length > cursorPosition
    ) {
      const currentElementKey = getCurrentElementFromCursorPosition(
        validatedOptions,
        cursorPosition + 1,
      );
      console.log(currentElementKey);
      if (!currentElementKey) return;
      console.log(validatedOptions, currentElementKey);
      const newCursorPosition = getElementPositionInSelectionState(
        validatedOptions,
        currentElementKey,
      )?.end;
      if (newCursorPosition !== undefined) {
        setCursorPosition(newCursorPosition);
      }
    } else if (cursorPosition !== undefined) {
      setCursorPosition(cursorPosition + 1);
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    if (!validatedOptions || !(cursorPosition != undefined)) return;
    const currentElementKey = getCurrentElementFromCursorPosition(
      validatedOptions,
      cursorPosition,
    );
    if (currentElementKey) {
      e.preventDefault();
      onChange(updateSelectionState(options, currentElementKey, false));
      setCursorPosition(cursorPosition - currentElementKey.length - 2);
    }
  };

  useEffect(() => {
    setFilteredOptions({ ...filteredOptions, ...options });
    setValidatedOptions(stateToValidatedState(validatedOptions, options));
  }, [options]);

  useEffect(() => {
    setValidatedOptionsString(selectionStateTrueToString(validatedOptions));
  }, [validatedOptions]);

  useEffect(() => {
    setInputValue(validatedOptionsString);
    setCursorPosition(validatedOptionsString.length);
  }, [validatedOptionsString]);

  const keyboardNavigation = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    switch (e.key) {
      case 'Tab':
      case 'ArrowDown':
        e.preventDefault();
        handleTabOrArrowDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleArrowUp();
        break;
      case 'Enter':
        handleEnter();
        break;
      case 'ArrowLeft':
        handleArrowLeft();
        break;
      case 'ArrowRight':
        handleArrowRight();
        break;
      /*case 'Escape':
        handleEscape();
        break;*/
      case 'Backspace':
        handleBackspace(e);
        break;
      /*default:
        handleDefault(e);
        break;*/
    }
  };

  return (
    <div ref={wrapperRef}>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        style={{ textOverflow: 'ellipsis' }}
        value={inputValue}
        onChange={handleTextChange}
        onFocus={() => setIsDropdownDisplayed(true)}
        onKeyDown={(e) => keyboardNavigation(e)}
        showClearButton={isDropdownDisplayed}
        showDropdownIcon
        isDropdownActive={isDropdownDisplayed}
        onClear={() => onChange(setAllFalse(options))}
        onCursorPositionChange={(position) => {
          setCursorPosition(position);
        }}
        setCursorPosition={adjustCursorPosition}
      />
      {isDropdownDisplayed && (
        <div
          className={styles.dropdown}
          onKeyDown={(e) => keyboardNavigation(e)}
          onClick={() => {
            onChange(
              toggleSelectionStateAtIndex(filteredOptions, highlightedIndex),
            );
          }}
          tabIndex={-1}
        >
          <MultiCheckbox
            options={filteredOptions}
            size={size}
            onChange={handleMultiCheckboxChange}
            styleCheckbox={{ padding: '6px 10px', cursor: 'pointer' }}
            hoveredIndex={highlightedIndex}
            setHoveredIndex={setHighlightedIndex}
          />
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
