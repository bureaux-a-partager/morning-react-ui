import {
  useEffect,
  useState,
  useCallback,
  useRef,
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
} from 'react';
import { SelectionState } from 'morning-react-ui/types/dataTypes';
import { Size } from 'morning-react-ui/utils/Enum';
import { selectionStateTrueToString } from 'morning-react-ui/utils/selectionState/selectionStateConverters';
import {
  atLeastOneTrue,
  getCurrentElementFromCursorPosition,
  getElementPositionInSelectionState,
  mergeAndValidateStates,
} from 'morning-react-ui/utils/selectionState/selectionStateInfo';
import {
  setAllFalse,
  setAllTrue,
  toggleSelectionStateAtIndex,
  updateSelectionState,
} from 'morning-react-ui/utils/selectionState/selectionStateModifiers';
import { normalizeString } from 'morning-react-ui/utils/stringUtils';

type UseMultiSelectProps = {
  options: SelectionState;
  onChange: (newSelection: SelectionState) => void;
  size: Size;
  rowToDisplay: number;
};

const useMultiSelect = ({
  options,
  onChange,
  size,
  rowToDisplay,
}: UseMultiSelectProps) => {
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
  const [displaySelectAll, setDisplaySelectAll] = useState(true);
  const [checkboxRefs, setCheckboxRefs] = useState<
    React.RefObject<HTMLInputElement>[]
  >([]);
  const [savedCursorPosition, setSavedCursorPosition] = useState<number | null>(
    null,
  );
  const [maxHeight, setMaxHeight] = useState(0);

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue: string = e.target.value;
    setInputValue(newValue);
  };

  // Filter options with a string
  const filterSelectionStateByKey = (value: string): SelectionState => {
    const inputValueLower = normalizeString(value);
    return Object.keys(options)
      .filter((key) => normalizeString(key).includes(inputValueLower))
      .reduce((acc: SelectionState, key) => {
        acc[key] = options[key];
        return acc;
      }, {});
  };

  // Click outside of the component close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownDisplayed(false);
      }
    };

    // Only add the event listener if the dropdown is displayed
    if (isDropdownDisplayed) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (isDropdownDisplayed) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [isDropdownDisplayed, wrapperRef]);

  useEffect(() => {
    if (savedCursorPosition !== null) {
      setCursorPosition(savedCursorPosition);
      setSavedCursorPosition(null);
    }
    setFilteredOptions(
      filterSelectionStateByKey(inputValue.replace(validatedOptionsString, '')),
    );
    if (inputValue.replace(validatedOptionsString, '') !== '') {
      setHighlightedIndex(0);
    }
  }, [inputValue]);

  // Reset highlighted index on dropdown close
  useEffect(() => {
    setHighlightedIndex(!isDropdownDisplayed ? null : 0);
  }, [isDropdownDisplayed]);

  // Move cursor & camera
  const adjustCursorPosition = useCallback(() => {
    const input = inputRef.current;
    if (input && cursorPosition !== null && isDropdownDisplayed) {
      // Assurez-vous que le curseur est défini correctement
      input.setSelectionRange(cursorPosition, cursorPosition);

      // Définition d'un "padding" pour le défilement, ici 20% de la largeur de l'input
      const scrollPadding = input.offsetWidth * 0.05;

      // Calcul du défilement nécessaire pour maintenir le curseur dans le "padding" visuel
      // La position du curseur en proportion de la longueur totale du texte
      const cursorProportion = cursorPosition / inputValue.length;

      // Calcul de la position de défilement idéale en fonction de la proportion du curseur
      const idealScrollPosition =
        input.scrollWidth * cursorProportion - scrollPadding;

      // Ajustement du défilement pour essayer de centrer le curseur dans le "padding" visuel
      if (
        idealScrollPosition < input.scrollLeft + scrollPadding ||
        idealScrollPosition >
          input.scrollLeft + input.offsetWidth - scrollPadding
      ) {
        input.scrollLeft =
          idealScrollPosition - input.offsetWidth / 2 + scrollPadding;
      }
    }
  }, [cursorPosition, inputValue.length, isDropdownDisplayed]);

  // Make the highlighted index scroll into view
  useEffect(() => {
    if (highlightedIndex != null && highlightedIndex < checkboxRefs.length) {
      const ref = checkboxRefs[highlightedIndex];
      if (ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex, checkboxRefs]);

  // Calculate the height to display the right number of elements before scrolling
  useEffect(() => {
    if (checkboxRefs.length === 0) {
      setMaxHeight(0);
      return;
    }

    const paddingBottom = 15;
    if (checkboxRefs.length < rowToDisplay) {
      const lastRef = checkboxRefs[checkboxRefs.length - 1]?.current;
      const firstRef = checkboxRefs[0]?.current;
      if (lastRef && firstRef) {
        setMaxHeight(
          lastRef.offsetTop -
            firstRef.offsetTop +
            firstRef.offsetHeight +
            paddingBottom,
        );
      }
    } else {
      const lastRef = checkboxRefs[rowToDisplay - 1]?.current;
      const firstRef = checkboxRefs[0]?.current;
      if (lastRef && firstRef) {
        setMaxHeight(
          lastRef.offsetTop -
            firstRef.offsetTop +
            firstRef.offsetHeight +
            paddingBottom,
        );
      }
    }
  }, [size, rowToDisplay, checkboxRefs]);

  const handleFocus = () => {
    setIsDropdownDisplayed(true);
    // Slow cursor movement to make sure it's applied after everything else
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        const endOfText = input.value.length;
        input.setSelectionRange(endOfText, endOfText);
      }
    }, 0);
  };

  const handleTabOrArrowDown = () => {
    if (highlightedIndex === null) {
      setHighlightedIndex(0);
    } else {
      const newIndex =
        (highlightedIndex + 1) %
        (Object.keys(filteredOptions).length + +displaySelectAll);
      setHighlightedIndex(newIndex);
    }
  };

  const handleArrowUp = () => {
    if (highlightedIndex === null) {
      return;
    }
    const optionsLength =
      Object.keys(filteredOptions).length + (displaySelectAll ? 1 : 0);
    const newIndex = (highlightedIndex + optionsLength - 1) % optionsLength;
    setHighlightedIndex(newIndex);
  };

  const makeHighlightedIndexSelected = () => {
    // Ensure the input field is focused if it's not already the active element
    if (document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
    }

    // Do nothing if no index is highlighted
    if (highlightedIndex === null || Object.keys(filteredOptions).length < 1) {
      return;
    }

    // Handle the "select all" functionality, if applicable
    if (displaySelectAll && highlightedIndex === 0) {
      // Toggle between selecting all options and deselecting all, based on current state
      if (atLeastOneTrue(options)) {
        onChange(setAllFalse(options)); // Deselect all options if at least one is currently selected
      } else {
        onChange(setAllTrue(options)); // Select all options if none are currently selected
      }
      return; // Exit the function after handling "select all"
    }

    // Update the selection state for a specific highlighted option, adjusting for "select all" option presence
    onChange({
      ...options,
      ...toggleSelectionStateAtIndex(
        filteredOptions,
        highlightedIndex - +displaySelectAll, // Adjust index if "select all" is displayed
      ),
    });
  };

  const handleEnter = () => {
    if (highlightedIndex === null || Object.keys(filteredOptions).length < 1) {
      return;
    }
    makeHighlightedIndexSelected();
  };

  const handleArrowLeft = () => {
    if (!inputRef.current) {
      return;
    }

    // Case where validated options exist and the cursor is within or at the start of these options
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
      // Case for simply moving the cursor to the left
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleArrowRight = () => {
    if (cursorPosition === null || !inputRef.current) {
      return;
    }

    // Case where validated options exist and the cursor is not at the end of these options
    if (validatedOptions && cursorPosition < validatedOptionsString.length) {
      const currentElementKey = getCurrentElementFromCursorPosition(
        validatedOptions,
        cursorPosition + 1,
      );
      if (currentElementKey) {
        const newCursorPosition = getElementPositionInSelectionState(
          validatedOptions,
          currentElementKey,
        )?.end;
        if (newCursorPosition !== undefined) {
          setCursorPosition(newCursorPosition);
          return;
        }
      }
    }
    // Case for simply moving the cursor to the right
    if (cursorPosition < inputValue.length) {
      setCursorPosition(cursorPosition + 1);
    }
  };

  const handleKeyAction = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>, // Event from the keyboard action
    getPosition: () => string | null, // Function to get the current element's key based on the cursor's position
  ) => {
    const currentElementKey = getPosition(); // Attempt to retrieve the current element's key
    // Exit if no validated options are available or the cursor position is not set
    if (!validatedOptions || cursorPosition === null) {
      return;
    }

    if (currentElementKey) {
      e.preventDefault(); // Prevent the default key action to manage cursor movement manually

      // Attempt to retrieve the start position of the current element in the selection state
      const elementStartPosition = getElementPositionInSelectionState(
        validatedOptions,
        currentElementKey,
      )?.start;

      if (elementStartPosition !== undefined) {
        // Update the saved cursor position to the start of the current element
        setSavedCursorPosition(elementStartPosition);
      }

      // Update the selection state based on the current action and adjust the cursor position accordingly
      onChange(updateSelectionState(options, currentElementKey, false));
      setCursorPosition(cursorPosition - currentElementKey.length - 2);
    }
  };

  const handleBackspace = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    handleKeyAction(e, () =>
      getCurrentElementFromCursorPosition(validatedOptions, cursorPosition),
    );
  };

  const handleDelete = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    if (!validatedOptions || cursorPosition === null) {
      return;
    }
    handleKeyAction(e, () =>
      getCurrentElementFromCursorPosition(validatedOptions, cursorPosition + 1),
    );
  };

  const handleEscape = () => {
    setIsDropdownDisplayed(false);
    inputRef?.current?.blur();
  };

  const handleDefault = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    if (cursorPosition === null) {
      return;
    }
    if (cursorPosition < inputValue.length) {
      e.preventDefault();
    }
  };

  // if options is modified => update filteredOptions and validatedOptions
  useEffect(() => {
    setFilteredOptions({ ...filteredOptions, ...options });
    setValidatedOptions(mergeAndValidateStates(validatedOptions, options));
  }, [options]);

  // if filteredOptions is modified =>
  // check if it's the same as options and if it is it will display the select all checkbox
  useEffect(() => {
    setDisplaySelectAll(
      JSON.stringify(options) === JSON.stringify(filteredOptions),
    );
  }, [filteredOptions]);

  //If validatedOptions is modified => transform it into a string
  useEffect(() => {
    setValidatedOptionsString(selectionStateTrueToString(validatedOptions));
  }, [validatedOptions]);

  // if validatedOptionsString is updated => update input value and the cursorPosition
  useEffect(() => {
    setInputValue(validatedOptionsString);
    setCursorPosition(validatedOptionsString.length);
  }, [validatedOptionsString]);

  // Avoid click and dropdown to make the inputText blur
  const handleDropdownMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

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
        e.preventDefault();
        handleArrowLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleArrowRight();
        break;
      case 'Escape':
        handleEscape();
        break;
      case 'Backspace':
        handleBackspace(e);
        break;
      case 'Delete':
        handleDelete(e);
        break;
      default:
        handleDefault(e);
        break;
    }
  };

  return {
    checkboxRefs,
    setCheckboxRefs,
    keyboardNavigation,
    adjustCursorPosition,
    isDropdownDisplayed,
    filteredOptions,
    handleTextChange,
    wrapperRef,
    inputRef,
    inputValue,
    setCursorPosition,
    highlightedIndex,
    setHighlightedIndex,
    displaySelectAll,
    makeHighlightedIndexSelected,
    handleDropdownMouseDown,
    handleFocus,
    maxHeight,
  };
};

export default useMultiSelect;
