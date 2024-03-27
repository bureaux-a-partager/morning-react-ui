import { forwardRef, CSSProperties } from 'react';
import classNames from 'classnames';
import { Size } from '@/utils/Enum';
import { BasicInputProps } from '@/components/inputs/types';
import styles from './parentInput.module.css';

type ParentInputProps = BasicInputProps & {
  children: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
  style?: CSSProperties;
};

const ParentInput = forwardRef<HTMLDivElement, ParentInputProps>(
  (
    {
      label,
      isLabelBold,
      sublabel,
      size = Size.m,
      children,
      inputRef,
      disabled,
    },
    ref,
  ) => {
    const focusInput = () => {
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div
        ref={ref}
        className={classNames(
          styles.parentInput,
          styles[size],
          `font-size-${size}`,
          { disabled: disabled },
        )}
      >
        {(label || sublabel) && (
          <div className={styles.labelsContainer}>
            {label && (
              <label
                className={classNames(styles.label, {
                  ['bold']: isLabelBold,
                })}
                onClick={focusInput}
              >
                {label}
              </label>
            )}
            {sublabel && (
              <div
                className={classNames(styles.sublabel, styles[size])}
                onClick={focusInput}
              >
                {sublabel}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    );
  },
);

ParentInput.displayName = 'ParentInput';

export default ParentInput;
