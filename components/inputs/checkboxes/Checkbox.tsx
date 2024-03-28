import { CSSProperties } from 'react';
import classNames from 'classnames';
import { Size, sizeToFontSize, sizeToNumber } from '@/utils/Enum';
import styles from './checkbox.module.css';
import { TriState } from '../types';

type CheckboxProps = {
  label: string;
  onChange: (value: TriState) => void;
  size?: Size;
  disabled?: boolean;
  value: TriState;
  isError?: boolean;
  style?: CSSProperties;
};

type CheckboxHTMLProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  keyof CheckboxProps
>;

const Checkbox = ({
  label,
  onChange,
  size = Size.m,
  value,
  disabled = false,
  isError = false,
  style,
  ...props
}: CheckboxProps & CheckboxHTMLProps) => {
  const checkboxClass = classNames({
    [styles.checkbox]: true,
    [styles.active]: value === TriState.true,
    [styles.empty]: value === TriState.false,
    [styles.minus]: value === TriState.indeterminate,
    ['disabled']: disabled,
  });
  const handleClick = () => {
    if (disabled) return;
    onChange(value === TriState.false ? TriState.true : TriState.false);
  };
  return (
    <div
      className={styles.wrapper}
      style={{
        lineHeight: `${sizeToNumber(size)}px`,
        fontSize: `${sizeToFontSize(size)}px`,
        ...style,
      }}
      {...props}
    >
      <span
        className={checkboxClass}
        onClick={handleClick}
        style={{
          width: `${sizeToNumber(size)}px`,
          height: `${sizeToNumber(size)}px`,
        }}
      ></span>
      <label
        className={`${isError ? styles.error : styles.label} ${disabled ? 'disabled' : 'pointer'}`}
        onClick={handleClick}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
