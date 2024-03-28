import {
  ChangeEvent,
  ChangeEventHandler,
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { Size, sizeToNumber } from '@/utils/Enum';
import TextInput from '@/components/inputs/textField/TextInput';
import styles from '@/components/inputs/selectField/selectInput.module.css';
import { InputProps } from '@/components/inputs/types';
import { normalizeString } from '@/utils/stringUtils';

type SelectInputProps = InputProps & {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const SelectInput = forwardRef<HTMLInputElement, SelectInputProps>(
  ({
    label,
    sublabel,
    isLabelBold,
    size = Size.m,
    options,
    placeholder,
    disabled,
    onChange,
    isRequired,
  }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isError, setIsError] = useState(false);
    const [isDropdownDisplayed, setIsDropdownDisplayed] =
      useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleTextChange: ChangeEventHandler<HTMLInputElement> = (
      e: ChangeEvent<HTMLInputElement>,
    ): void => {
      const text = e.target.value;
      setInputValue(text);
      setSearchText(text);
      if (text === '') {
        setSelectedOption('');
      }
      setHighlightedIndex(0);
    };

    const selectOption = (option: string) => {
      setInputValue(option);
      setSelectedOption(option);
      setIsError(false);
      setIsDropdownDisplayed(false);
      onChange(option);
      setHighlightedIndex(-1);
      setSearchText('');
    };

    const handleFocus = () => {
      setIsDropdownDisplayed(true);
      if (selectedOption) {
        setInputValue('');
      }
      setSearchText('');
    };

    const handleBlur = () => {
      if (selectedOption) {
        setInputValue(selectedOption);
        setIsError(false);
      } else if (isRequired && !inputValue.trim()) {
        setIsError(true);
      } else {
        setIsError(false);
      }
    };

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!isDropdownDisplayed) return;

        let newIndex = highlightedIndex;
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            newIndex = (highlightedIndex + 1) % filteredOptions.length;
            break;
          case 'ArrowUp':
            event.preventDefault();
            newIndex =
              (highlightedIndex - 1 + filteredOptions.length) %
              filteredOptions.length;
            break;
          case 'Enter':
            event.preventDefault();
            if (highlightedIndex >= 0 && filteredOptions.length > 0) {
              const selected = filteredOptions[newIndex];
              selectOption(selected);
            }
            break;
          case 'Escape':
            setIsDropdownDisplayed(false);
            break;
        }
        setHighlightedIndex(newIndex);
      },
      [highlightedIndex, filteredOptions, isDropdownDisplayed],
    );

    useEffect(() => {
      setFilteredOptions(options);
      setHighlightedIndex(0);
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        wrapperRef.current
          ?.querySelectorAll('.option')
          [
            highlightedIndex
          ]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, [options]);

    useEffect(() => {
      if (!searchText) {
        setFilteredOptions(options);
      } else {
        const normalizedSearchText = normalizeString(searchText);
        const newFilteredOptions = options.filter((option) =>
          normalizeString(option).includes(normalizedSearchText),
        );
        setFilteredOptions(newFilteredOptions);
      }
    }, [searchText, options]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsDropdownDisplayed(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [handleKeyDown, wrapperRef]);

    return (
      <div className={styles.wrapper} ref={wrapperRef} tabIndex={-1}>
        <Image
          src={
            'https://storage.googleapis.com/morning-react-ui-data/icons/arrow.svg'
          }
          alt={'arrow down'}
          className={classNames(styles[size], styles.arrow, {
            [styles.arrowUp]: isDropdownDisplayed,
          })}
          height={sizeToNumber(size)}
          width={sizeToNumber(size)}
        />
        <TextInput
          placeholder={selectedOption || placeholder}
          size={size}
          value={inputValue}
          label={label}
          sublabel={sublabel}
          isLabelBold={isLabelBold}
          onChange={handleTextChange}
          onFocus={handleFocus}
          disabled={disabled}
          isRequired={isRequired}
          onBlur={handleBlur}
          isError={isError}
        />
        {isDropdownDisplayed && (
          <div className={styles.dropdown}>
            {filteredOptions?.map((option, index) => (
              <div
                className={classNames(styles.option, styles[size], {
                  [styles.selectedOption]: selectedOption === option,
                  [styles.highlightedOption]: index === highlightedIndex,
                })}
                key={index}
                onClick={() => selectOption(option)}
                onMouseDown={() => selectOption(option)}
              >
                {option}
                {selectedOption === option && (
                  <Image
                    src='https://storage.googleapis.com/morning-react-ui-data/icons/success.svg'
                    alt='Selected'
                    width={sizeToNumber(size)}
                    height={sizeToNumber(size)}
                    className={styles.selectedOptionIcon}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;
