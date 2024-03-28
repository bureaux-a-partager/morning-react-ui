import React, {
  ChangeEvent,
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import classNames from 'classnames';
import { format, setMinutes, setHours } from 'date-fns';
import { Size, sizeToHeight } from '@/utils/Enum';
import ParentInput from '@/components/inputs/ParentInput';
import { BasicInputProps, InputProps } from '@/components/inputs/types';
import styles from '../input.module.css';
import useInput from './useInput';

type TimeInputProps = BasicInputProps &
  InputProps & {
    value: Date;
    onChange: (time: Date) => void;
    setError: (isError: boolean) => void;
    callback?: () => boolean;
  };

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      label,
      sublabel,
      isLabelBold,
      size = Size.m,
      value,
      isError,
      disabled,
      onChange,
      setError,
      callback,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(
      format(value, 'HH:mm'),
    );
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const stringToTime = (time: string): [number, number] => {
      const [hours, minutes] = time
        .split(':')
        .map((part) => (part.length ? parseInt(part.slice(-2)) : 0));
      return [hours, minutes || 0];
    };

    const isStringValidAsTime = (time: string): boolean => {
      if (
        time.replace(/[0-9:]/g, '').length > 0 ||
        time.split(':').length > 2 ||
        time.replace(/:/g, '').length > 4
      ) {
        return false;
      }
      const [hours, minutes] = stringToTime(time);
      return (
        hours >= 0 &&
        hours < 24 &&
        minutes >= 0 &&
        minutes < 60 &&
        (callback ? callback() : true)
      );
    };

    /**
     * Function used to reformat the input value to a readable time value
     * Function is called on every change in input value
     */
    const reformatTime = (
      time: string,
      event: ChangeEvent<HTMLInputElement>,
    ): string => {
      // First try to find a ':' in the input value to match a pattern like 'HH:mm'
      if (time.match(/:/g)) {
        // If matched, will then split the string using ':' to get an hour value and a minute value
        const [hours, minutes] = time.split(':');
        // Will reformat the string value using the first 2 char of each part locking the date in place
        // i.e. if a date if fully formed, the input will not change. User will have to erase char to change time value.
        return `${hours.slice(0, 2)}:${minutes.length ? minutes.slice(0, 2) : ''}`;
      }

      // If the pattern 'HH:mm' is not matched, will try to see if a ':' was in previous value
      if (inputValue.match(/:/g)) {
        // If that was the case, means that the ':' was erased
        // Will then split the previous value using ':' to get a previous hour value and previous minute value
        // Erasing a ':' means that user tried to erased last digit of hour value, will reformat a time value accordingly
        const [previousHours, previousMinutes] = inputValue.split(':');
        // Reposition cursor depending on whether or not a char is  present in the hour value
        setTimeout(() => {
          event.target.focus();
          event.target.setSelectionRange(
            previousHours.slice(0, -1).length,
            previousHours.slice(0, -1).length,
          );
        }, 0);
        return (
          previousHours.slice(0, -1) +
          (previousMinutes.length ? `:${previousMinutes.slice(-2)}` : '')
        );
      }

      // If nothing neither current nor previous values have ':', then proceed as normal
      return time.length < 2 ? time : `${time}:`;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      const reformatedNewValue = reformatTime(newValue, event);
      const validAsTime = isStringValidAsTime(reformatedNewValue);

      setError(!validAsTime);

      if (validAsTime) {
        setInputValue(reformatedNewValue);
      }
    };

    const handleBlur = () => {
      const [hours, minutes] = stringToTime(inputValue);
      setError(false);
      onChange(setMinutes(setHours(new Date(), hours), minutes));
    };

    useEffect(() => {
      setInputValue(format(value, 'HH:mm'));
    }, [value]);

    const { handleWrapperClick } = useInput({ inputRef });

    return (
      <ParentInput
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        disabled={disabled}
      >
        <div
          className={classNames(
            styles.wrapper,
            `padding-${size}`,
            { ['cursorText']: !disabled },
            {
              [styles.error]: isError,
            },
          )}
          style={{ height: `${sizeToHeight(size)}px` }}
          onClick={handleWrapperClick}
        >
          <input
            className={classNames(styles.input, `font-size-${size}`)}
            ref={inputRef}
            placeholder={'HH:MM'}
            disabled={disabled}
            type='text'
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </ParentInput>
    );
  },
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
