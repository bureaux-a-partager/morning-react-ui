import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Size } from '@/utils/Enum';
import {
  selectionStateTrueToString,
  setAllFalse,
  stateToValidatedState,
  toggleSelectionStateAtIndex,
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
  const [hightlightedIndex, setHighlightedIndex] = useState<number | undefined>(
    0,
  );

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

  const handleTabOrArrowDown = () => {
    if (hightlightedIndex === undefined) setHighlightedIndex(0);
    else {
      const newIndex =
        (hightlightedIndex + 1) % Object.keys(filteredOptions).length;
      setHighlightedIndex(newIndex);
    }
  };

  const handleArrowUp = () => {
    if (hightlightedIndex === undefined) return;
    const newIndex =
      (hightlightedIndex - 1 + Object.keys(filteredOptions).length) %
      Object.keys(filteredOptions).length;
    setHighlightedIndex(newIndex);
  };

  const handleEnter = () => {
    if (hightlightedIndex === undefined) return;
    const optionKeys = Object.keys(filteredOptions);
    const selectedKey = optionKeys[hightlightedIndex];
    if (!selectedKey) return;
    const newValue = !filteredOptions[selectedKey];
    const oneSelectionState: SelectionState = {
      [selectedKey]: newValue,
    };
    onChange({ ...options, ...oneSelectionState });
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
      /*case 'ArrowLeft':
        handleArrowLeft();
        break;
      case 'ArrowRight':
        handleArrowRight();
        break;
      case 'Escape':
        handleEscape();
        break;
      case 'Backspace':
        handleBackspace();
        break;
      default:
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
        value={inputValue}
        onChange={handleTextChange}
        onFocus={() => setIsDropdownDisplayed(true)}
        onKeyDown={(e) => keyboardNavigation(e)}
        showClearButton
        showDropdownIcon
        isDropdownActive={isDropdownDisplayed}
        onClear={() => onChange(setAllFalse(options))}
        /*onCursorPositionChange={(position) => {
          setCursorPosition(position);
        }}
        setCursorPosition={adjustCursorPosition}*/
      />
      {isDropdownDisplayed && (
        <div
          className={styles.dropdown}
          onKeyDown={(e) => keyboardNavigation(e)}
          onClick={() => {
            onChange(
              toggleSelectionStateAtIndex(filteredOptions, hightlightedIndex),
            );
          }}
          tabIndex={-1}
        >
          <MultiCheckbox
            options={filteredOptions}
            size={size}
            onChange={handleMultiCheckboxChange}
            styleCheckbox={{ padding: '6px 10px', cursor: 'pointer' }}
            hoveredIndex={hightlightedIndex}
            setHoveredIndex={setHighlightedIndex}
          />
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
