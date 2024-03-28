import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Size } from '@/utils/Enum';
import ParentInput from '@/components/inputs/ParentInput';
import { InputProps } from '@/components/inputs/types';
import styles from '../input.module.css';
import useInput from './useInput';

type NumberInputProps = InputProps & {
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      sublabel,
      isLabelBold,
      size = Size.m,
      value,
      onChange,
      min,
      max,
      isError,
      disabled,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<number | undefined>(value);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const getValidValue = (val: number | undefined): number => {
      if (val === undefined) {
        return NaN;
      }
      return isNaN(val) ? NaN : val;
    };

    const validateAndSet = (val: number) => {
      if (
        (min !== undefined && val < min) ||
        (max !== undefined && val > max)
      ) {
        return;
      }
      setInputValue(val);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue === '') {
        setInputValue(NaN);
        return;
      }
      const parsedValue = parseInt(newValue, 10);
      if (!isNaN(parsedValue)) {
        validateAndSet(parsedValue);
      }
    };

    const handleBlur = () => {
      const validValue = getValidValue(inputValue);
      onChange(validValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        return;
      }
      event.preventDefault();
      const testedValue = getValidValue(inputValue);
      let newValue = isNaN(testedValue) ? 0 : testedValue;
      event.key === 'ArrowUp' ? newValue++ : newValue--;
      validateAndSet(newValue);
    };

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const { handleWrapperClick } = useInput({ inputRef });

    return (
      <ParentInput
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        inputRef={inputRef}
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
          onClick={handleWrapperClick}
        >
          <input
            type='number'
            className={classNames(styles.input, `font-size-${size}`)}
            ref={inputRef}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            value={isNaN(getValidValue(inputValue)) ? '' : inputValue}
            min={min}
            max={max}
            disabled={disabled}
          />
        </div>
      </ParentInput>
    );
  },
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
