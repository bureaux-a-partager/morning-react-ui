import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
} from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import ParentInput from '@/components/inputs/ParentInput';
import { Size, sizeToNumber } from '@/utils/Enum';
import { InputProps } from '@/components/inputs/types';
import styles from '../input.module.css';

type TextInputProps = InputProps & {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCursorPositionChange?: (position: number | null) => void;
  setCursorPosition?: (input: HTMLInputElement) => void;
  imageSrc?: string;
  imageAlt?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      sublabel,
      isLabelBold,
      size = Size.m,
      value,
      onChange,
      onCursorPositionChange,
      setCursorPosition,
      placeholder,
      isError,
      disabled,
      isRequired,
      imageSrc,
      imageAlt,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [lastCursorPosition, setLastCursorPosition] = useState<number | null>(
      null,
    );

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (setCursorPosition && inputRef.current) {
        setCursorPosition(inputRef.current);
      }
    }, [setCursorPosition]);

    const handleCursorChange = (position: number | null) => {
      if (position !== lastCursorPosition) {
        setLastCursorPosition(position);
        if (onCursorPositionChange) {
          onCursorPositionChange(position);
        }
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event);
      handleCursorChange(event.target.selectionStart);
    };

    const handleKeyUpOrClick = (
      event: MouseEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>,
    ) => {
      handleCursorChange(event.currentTarget.selectionStart);
    };

    return (
      <ParentInput
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        inputRef={inputRef}
        disabled={disabled}
      >
        <div className={styles.wrapper}>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={imageAlt || 'input icon'}
              width={sizeToNumber(size)}
              height={sizeToNumber(size)}
              className={classNames(styles[size], styles.image)}
            />
          )}
          <input
            className={classNames(
              styles.input,
              styles[size],
              { [styles.error]: isError },
              { [styles.disabled]: 'disabled' },
              { [styles.hasImage]: imageSrc },
            )}
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onClick={handleKeyUpOrClick}
            {...props}
          />
        </div>
      </ParentInput>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
