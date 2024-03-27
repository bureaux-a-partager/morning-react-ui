import {
  useEffect,
  useState,
  useCallback,
  useRef,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';
import {
  getCurrentElementFromCursorPosition,
  getElementPositionInSelectionState,
  removeElementFromSelectionState,
  selectionStateToString,
} from '@/utils/selectionStateUtils';
import { SelectionState } from '@/components/inputs/types';

type UseMultiSelectProps = {
  options: SelectionState;
  onChange: (newSelection: SelectionState) => void;
};

const useMultiSelect = ({ options, onChange }: UseMultiSelectProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [localOptions, setLocalOptions] = useState(options);
  const [validatedOptions, setValidatedOptions] = useState<
    SelectionState | undefined
  >();
  const [validatedOptionsString, setValidatedOptionsString] = useState('');
  const [isDropdownDisplayed, setIsDropdownDisplayed] =
    useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] =
    useState<SelectionState>(options);
  const [hightlightedIndex, setHighlightedIndex] = useState<number | undefined>(
    0,
  );
  const [cursorPosition, setCursorPosition] = useState<number | null>(0);
  const [savedCursorPosition, setSavedCursorPosition] = useState<number | null>(
    0,
  );

  const adjustCursorPosition = useCallback(() => {
    const input = inputRef.current;
    if (input && cursorPosition !== null) {
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue: string = e.target.value;
    setInputValue(newValue);
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
    setFilteredOptions(
      filterSelectionStateByKey(inputValue.replace(validatedOptionsString, '')),
    );
  }, [inputValue]);

  const handleMultiCheckboxChange = (optionsToChange: SelectionState) => {
    setFilteredOptions(optionsToChange);
    setLocalOptions(optionsToChange);
  };

  useEffect(() => {
    if (validatedOptions)
      setValidatedOptionsString(`${selectionStateToString(validatedOptions)} `);
  }, [validatedOptions]);

  useEffect(() => {
    onChange(localOptions);
  }, [localOptions]);

  useEffect(() => {
    setInputValue(validatedOptionsString);
    if (savedCursorPosition === null)
      setCursorPosition(validatedOptionsString.length);
    else {
      setCursorPosition(savedCursorPosition);
      setSavedCursorPosition(null);
    }
  }, [validatedOptionsString]);

  useEffect(() => {
    setLocalOptions((currentLocalOptions) => {
      const updatedLocalOptions = { ...currentLocalOptions };
      Object.keys(updatedLocalOptions).forEach((key) => {
        if (validatedOptions)
          if (!Object.prototype.hasOwnProperty.call(validatedOptions, key)) {
            updatedLocalOptions[key] = false;
          }
      });

      return updatedLocalOptions;
    });
  }, [validatedOptions]);

  useEffect(() => {
    if (isDropdownDisplayed) setHighlightedIndex(0);
  }, [isDropdownDisplayed]);

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

  const handleTabOrArrowDown = () => {
    if (hightlightedIndex === undefined) return;
    const newIndex =
      (hightlightedIndex + 1) % Object.keys(filteredOptions).length;
    setHighlightedIndex(newIndex);
  };

  const handleArrowUp = () => {
    if (hightlightedIndex === undefined) return;
    const newIndex =
      (hightlightedIndex - 1 + Object.keys(filteredOptions).length) %
      Object.keys(filteredOptions).length;
    setHighlightedIndex(newIndex);
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
        cursorPosition,
      );
      if (!currentElementKey) return;
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

  const handleEscape = () => {
    setIsDropdownDisplayed(false);
    inputRef?.current?.blur();
  };

  const handleBackspace = () => {
    if (!validatedOptions || !(cursorPosition != undefined)) return;
    const currentElementKey = getCurrentElementFromCursorPosition(
      validatedOptions,
      cursorPosition,
    );
    if (currentElementKey) {
      setValidatedOptions(
        removeElementFromSelectionState(validatedOptions, currentElementKey),
      );
      setSavedCursorPosition(cursorPosition - currentElementKey.length - 2);
    }
  };

  const handleEnter = () => {
    if (hightlightedIndex === undefined) return;
    const optionKeys = Object.keys(filteredOptions);
    const selectedKey = optionKeys[hightlightedIndex];
    if (selectedKey) {
      const newValue = !filteredOptions[selectedKey];
      const option: SelectionState = {
        [selectedKey]: newValue,
      };
      handleMultiCheckboxChange(
        mergeAndFilterSelectionStates(validatedOptions, option),
      );
    }
  };

  const handleDefault = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    if (
      cursorPosition === null ||
      !validatedOptionsString ||
      validatedOptionsString.length <= cursorPosition
    )
      return;
    e.preventDefault();
  };

  const keyboardNavigation = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    switch (e.key) {
      case 'Tab':
      case 'ArrowDown':
        handleTabOrArrowDown();
        break;
      case 'ArrowUp':
        handleArrowUp();
        break;
      case 'ArrowLeft':
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
      case 'Enter':
        handleEnter();
        break;
      default:
        handleDefault(e);
        break;
    }
  };
  return {
    keyboardNavigation,
    adjustCursorPosition,
    isDropdownDisplayed,
    filteredOptions,
    handleMultiCheckboxChange,
    handleTextChange,
    wrapperRef,
    inputRef,
    inputValue,
    setIsDropdownDisplayed,
    setCursorPosition,
    hightlightedIndex,
    setHighlightedIndex,
  };
};

export default useMultiSelect;
