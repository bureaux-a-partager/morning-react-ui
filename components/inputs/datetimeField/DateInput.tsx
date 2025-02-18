import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { setMilliseconds, setSeconds } from 'date-fns';
import { format } from 'date-fns/format';
import useIsMobile from 'morning-react-ui/components/hooks/useIsMobile';
import ParentInput from 'morning-react-ui/components/inputs/ParentInput';
import { OptionalDate } from 'morning-react-ui/types';
import {
  isDateWithinEdges,
  isStringValidAsDate,
  roundUpYear,
  stringToDate,
} from 'morning-react-ui/utils/datetimeUtils';
import { Size } from 'morning-react-ui/utils/Enum';
import { newCharInString } from 'morning-react-ui/utils/stringUtils';
import styles from '../input.module.css';
import { BasicInputProps, InputProps } from '../propsTypes';
import useInput from '../textField/useInput';
import CalendarComponent from './CalendarComponent';

type DateInputProps = BasicInputProps &
  InputProps & {
    value?: Date | null;
    from?: string;
    to?: string;
    onChange: (time: OptionalDate) => void;
  };

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      sublabel,
      bold,
      size,
      value,
      disabled,
      isError,
      from,
      to,
      onChange,
      placeholder = 'JJ/MM/AAAA',
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const finalSize = size ?? (isMobile ? Size.l : Size.m);
    const [inputValue, setInputValue] = useState<string | null>(
      value ? format(value, 'dd/MM/yyyy') : null,
    );

    const [error, setError] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const moveSelector = (
      event: ChangeEvent<HTMLInputElement>,
      startPosition: number,
      endPosition: number,
    ) => {
      setTimeout(() => {
        event.target.focus();
        event.target.setSelectionRange(startPosition, endPosition);
      }, 0);
    };

    /**
     * Function used to reformat the input value to a readable date value
     * Function is called on every change in input value
     */
    // eslint-disable-next-line complexity
    const reformatDate = (
      date: string | null,
      event: ChangeEvent<HTMLInputElement>,
    ): string => {
      // if null or empty in input, reformat function will return empty string
      if (date == null || date == '') {
        return '';
      }

      const currentBackslashes = date.match(/\//g);
      const previousBackslashes = inputValue ? inputValue.match(/\//g) : [];

      // Will first check if there is any backslash on current input
      if (currentBackslashes) {
        // If current input has 2 or more backslashes, means that the date is currently in this format : XX/XX/XXXX
        if (currentBackslashes.length >= 2) {
          const [day] = date.split('/');
          let [, month, year] = date.split('/');

          // Will check if day part has more than 2 char
          // in which case the carry character must be pass to the month part if this one is empty
          if (day.length > 2 && month.length == 0) {
            month = newCharInString(inputValue, date);
            moveSelector(event, 4, 4);
          }

          // Will check if month part has more than 2 char
          // in which case the carry character must be pass to the year part if this one is empty
          if (month.length > 2 && year.length == 0) {
            year = newCharInString(inputValue, date);
            moveSelector(event, 7, 7);
          }

          // Will proceed to reformat the date
          const finalForm = `${day.slice(0, 2)}/${month.slice(0, 2)}/${year.slice(0, 4)}`;

          return finalForm;
        }

        // If current input has only 1 backslashes
        if (currentBackslashes.length == 1) {
          const splitCurrent = date.split('/');
          const [currentDayValue, currentMonthValue] = splitCurrent;

          // Will first check if the previous input has more backslashes
          // If that is the case, then means that one was erased
          if (
            previousBackslashes &&
            previousBackslashes.length > 1 &&
            inputValue
          ) {
            // try and find which backslash was erased
            const splitPrevious = inputValue.split('/');
            const [previousDayValue, previousMonthValue, previousYearValue] =
              splitPrevious;

            if (inputValue.replace(/\//g, '').length == 0) {
              return inputValue.slice(0, -1);
            }

            // compares last value of split
            if (splitCurrent.slice(-1)[0] == splitPrevious.slice(-1)[0]) {
              moveSelector(
                event,
                previousDayValue.slice(0, -1).length,
                previousDayValue.slice(0, -1).length,
              );
              // if the last value are both the same, means that the first backslash was erased
              // if first backlash was erased, means that the last digit of day was deleted. Proceed to return correct value
              return `${previousDayValue.slice(0, -1)}/${previousMonthValue.slice(0, 2)}/${previousYearValue.slice(0, 4)}`;
            }

            moveSelector(
              event,
              previousDayValue.length +
                1 +
                previousMonthValue.slice(0, -1).length,
              previousDayValue.length +
                1 +
                previousMonthValue.slice(0, -1).length,
            );
            // otherwise, means that the second backslash was erased
            // in that case, means that the last digit of the month was deleted. Proceed to return correct value
            return `${previousDayValue.slice(0, 2)}/${previousMonthValue.slice(0, -1)}${
              previousYearValue.length
                ? `/${previousYearValue.slice(0, 4)}`
                : ''
            }`;
          }

          return `${currentDayValue.slice(0, 2)}/${currentMonthValue.slice(0, 2)}${
            currentMonthValue.length == 2 ? '/' : ''
          }`;
        }
      }

      // Else means that no backslash is in current input
      // Will still check if there was one in the previous input
      if (previousBackslashes && previousBackslashes.length > 0 && inputValue) {
        const splitPrevious = inputValue.split('/');
        const [previousDay, previousMonth] = splitPrevious;

        return `${previousDay.slice(0, 1)}${
          previousMonth.length ? `/${previousMonth}` : ''
        }`;
      }

      return `${date.slice(0, 2)}${date.length == 2 ? '/' : ''}`;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      const reformatedNewValue = reformatDate(newValue, event);

      if (reformatedNewValue == null) {
        setInputValue(reformatedNewValue);
        setError(false);
        return;
      }

      const validAsDate = isStringValidAsDate(reformatedNewValue);

      setError(!validAsDate);

      if (validAsDate) {
        setError(!isDateWithinEdges(reformatedNewValue, from, to));
        setInputValue(reformatedNewValue);
      }
    };

    const handleBlur = () => {
      if (!inputValue) {
        onChange(null);
        setError(false);
        return;
      }

      setError(!isDateWithinEdges(inputValue, from, to));
      const [day, month, year] = stringToDate(inputValue);
      const sanitizedDate = setMilliseconds(
        setSeconds(new Date(roundUpYear(year), month - 1, day), 0),
        0,
      );
      onChange(isDateWithinEdges(inputValue, from, to) ? sanitizedDate : null);
    };

    useEffect(() => {
      setInputValue(value ? format(value, 'dd/MM/yyyy') : null);
    }, [value]);

    const handleFocus = () => {
      setSelected(true);
    };

    const { handleWrapperClick } = useInput({ inputRef });

    return (
      <ParentInput
        label={label}
        sublabel={sublabel}
        bold={bold}
        size={finalSize}
        inputRef={inputRef}
      >
        <div
          className={classNames(
            styles.wrapper,
            styles.flex,
            `padding-${finalSize}`,
            { ['cursorText']: !disabled },
            {
              [styles.error]: isError || error,
            },
          )}
          onClick={handleWrapperClick}
        >
          <input
            className={classNames(styles.input, `font-size-${finalSize}`)}
            ref={inputRef}
            placeholder={placeholder}
            disabled={disabled}
            type='text'
            value={inputValue ?? ''}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <CalendarComponent
            inputValue={inputValue}
            from={from}
            to={to}
            parentRef={inputRef}
            display={selected}
            setDisplay={setSelected}
            onSelect={onChange}
          />
        </div>
      </ParentInput>
    );
  },
);

DateInput.displayName = 'DateInput';

export default DateInput;
