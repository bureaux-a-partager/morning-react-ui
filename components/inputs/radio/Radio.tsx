import { CSSProperties } from 'react';
import classNames from 'classnames';
import { Size, sizeToFontSize, sizeToNumber } from '@/utils/Enum';
import styles from './radio.module.css';

type RadioProps = {
  label: string;
  onChange: (value: boolean) => void;
  size?: Size;
  disabled?: boolean;
  value: boolean;
  style?: CSSProperties;
};

type RadioHTMLProps = Omit<React.HTMLProps<HTMLLabelElement>, keyof RadioProps>;

const Radio = ({
  label,
  onChange,
  size = Size.m,
  value,
  disabled = false,
  style,
  ...props
}: RadioProps & RadioHTMLProps) => {
  const radioClass = classNames({
    [styles.radio]: true,
    [styles.active]: value,
    [styles.empty]: !value,
    ['disabled']: disabled,
  });
  const handleClick = () => {
    if (disabled) return;
    onChange(value);
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        lineHeight: `${sizeToNumber(size)}px`,
        fontSize: `${sizeToFontSize(size)}px`,
        ...style,
      }}
    >
      <span
        className={radioClass}
        onClick={handleClick}
        style={{
          width: `${sizeToNumber(size)}px`,
          height: `${sizeToNumber(size)}px`,
        }}
      ></span>
      <label
        className={`${styles.label} ${disabled ? 'disabled' : 'pointer'}`}
        onClick={handleClick}
        {...props}
      >
        {label}
      </label>
    </div>
  );
};

export default Radio;
