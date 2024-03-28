import React, { ChangeEvent, forwardRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { format, setMinutes, setHours } from 'date-fns';
import { isAfter } from '@/node_modules/date-fns/isAfter';
import { isEqual } from '@/node_modules/date-fns/isEqual';
import { Size } from '@/utils/Enum';
import ParentInput from '@/components/inputs/ParentInput';
import { BasicInputProps, InputProps } from '@/components/inputs/types';
import styles from '../input.module.css';

type TimeInputProps = BasicInputProps &
  InputProps & {
    value: Date | false | null;
    min?: string;
    max?: string;
    onChange: (time: Date | null) => void;
  };

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      label,
      sublabel,
      isLabelBold,
      size = Size.m,
      value,
      disabled,
      isError,
      min,
      max,
      onChange,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState<string | null>(
      value ? format(value, 'HH:mm') : null,
    );

    const [error, setError] = useState<boolean>(false);

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
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    };

    const isWithinEdges = (
      time: string,
      minEdge?: string,
      maxEdge?: string,
    ): boolean => {
      const [hour, minute] = stringToTime(time);
      const reference = setMinutes(setHours(new Date(), hour), minute);
      let isRefAfterMin = true;
      let isRefBeforeMax = true;

      if (minEdge && isStringValidAsTime(minEdge)) {
        const [minHour, minMinute] = stringToTime(minEdge);
        const minTime = setMinutes(setHours(new Date(), minHour), minMinute);
        isRefAfterMin =
          isEqual(reference, minTime) || isAfter(reference, minTime);
      }

      if (maxEdge && isStringValidAsTime(maxEdge)) {
        const [maxHour, maxMinute] = stringToTime(maxEdge);
        const maxTime = setMinutes(setHours(new Date(), maxHour), maxMinute);
        isRefBeforeMax =
          isEqual(reference, maxTime) || isAfter(maxTime, reference);
      }

      return isRefBeforeMax && isRefAfterMin;
    };

    /**
     * Function used to reformat the input value to a readable time value
     * Function is called on every change in input value
     */
    const reformatTime = (
      time: string | null,
      event: ChangeEvent<HTMLInputElement>,
    ): string | null => {
      if (time == null || time == '') {
        return null;
      }

      // First try to find a ':' in the input value to match a pattern like 'HH:mm'
      if (time.match(/:/g)) {
        // If matched, will then split the string using ':' to get an hour value and a minute value
        const [hours, minutes] = time.split(':');
        // Will reformat the string value using the first 2 char of each part locking the date in place
        // i.e. if a date if fully formed, the input will not change. User will have to erase char to change time value.
        return `${hours.slice(0, 2)}:${minutes.length ? minutes.slice(0, 2) : ''}`;
      }

      // If the pattern 'HH:mm' is not matched, will try to see if a ':' was in previous value
      if (inputValue != null && inputValue.match(/:/g)) {
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
      return time.length < 2
        ? time
        : parseInt(time) >= 24
          ? `${time[0]}:${time[1]}`
          : `${time}:`;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      const reformatedNewValue = reformatTime(newValue, event);

      if (reformatedNewValue == null) {
        setInputValue(reformatedNewValue);
        setError(false);
        return;
      }

      const validAsTime = isStringValidAsTime(reformatedNewValue);
      setError(!validAsTime);

      if (validAsTime) {
        setError(!isWithinEdges(reformatedNewValue, min, max));
        setInputValue(reformatedNewValue);
      }
    };

    const handleBlur = () => {
      if (!inputValue) {
        onChange(null);
        setError(false);
        return;
      }

      setError(!isWithinEdges(inputValue, min, max));
      const [hours, minutes] = stringToTime(inputValue);
      onChange(
        isWithinEdges(inputValue, min, max)
          ? setMinutes(setHours(new Date(), hours), minutes)
          : false,
      );
    };

    useEffect(() => {
      setInputValue(value ? format(value, 'HH:mm') : null);
    }, [value]);

    return (
      <ParentInput
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        disabled={disabled}
      >
        <div className={styles.wrapper}>
          <input
            className={classNames(
              styles.input,
              styles[size],
              { [styles.error]: isError || error },
              { [styles.disabled]: disabled },
            )}
            ref={ref}
            placeholder={'HH:MM'}
            disabled={disabled}
            type='text'
            value={inputValue ?? ''}
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
