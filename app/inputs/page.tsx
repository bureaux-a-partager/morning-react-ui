'use client';

import Link from 'next/link';
import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import TextInput from '@/components/inputs/textField/TextInput';
import Container from '@/components/layout/Container';
import Columns from '@/components/layout/Columns';
import Column from '@/components/layout/Column';
import { Size } from '@/utils/Enum';
import NumberInput from '@/components/inputs/textField/NumberInput';
import TimeInput from '@/components/inputs/textField/TimeInput';

export default function Page() {
  const [value, setValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
  const [timeValue, setTimeValue] = useState<Date | false | null>(null);

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue: string = e.target.value;
    setValue(newValue);
  };

  const handleNumberChange = (newNumberValue: number) => {
    setNumberValue(newNumberValue);
  };

  const handleTimeChange = (newTimeValue: Date | null) => {
    setTimeValue(newTimeValue);
  };

  const renderTextInputs = (props: {
    label?: string;
    isLabelBold?: boolean;
    sublabel?: string;
    size?: Size;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    isError?: boolean;
    disabled?: boolean;
    imageSrc?: string;
    imageAlt?: string;
  }) => {
    return (
      <>
        <TextInput {...props} size={Size.xs} />
        <TextInput {...props} size={Size.s} />
        <TextInput {...props} size={Size.m} />
        <TextInput {...props} size={Size.l} />
        <TextInput {...props} size={Size.xl} />
      </>
    );
  };

  const renderNumberInputs = (props: {
    label?: string;
    isLabelBold?: boolean;
    sublabel?: string;
    size?: Size;
    value: number | undefined;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    isError?: boolean;
    disabled?: boolean;
  }) => {
    return (
      <>
        <NumberInput {...props} size={Size.xs} />
        <NumberInput {...props} size={Size.s} />
        <NumberInput {...props} size={Size.m} />
        <NumberInput {...props} size={Size.l} />
        <NumberInput {...props} size={Size.xl} />
      </>
    );
  };

  const renderTimeInputs = (props: {
    label?: string;
    sublabel?: string;
    isLabelBold?: boolean;
    size?: Size;
    value: Date | false | null;
    disabled?: boolean;
    isError?: boolean;
    min?: string;
    max?: string;
    onChange: (event: Date | null) => void;
  }) => {
    return (
      <>
        <TimeInput {...props} size={Size.xs} />
        <TimeInput {...props} size={Size.s} />
        <TimeInput {...props} size={Size.m} />
        <TimeInput {...props} size={Size.l} />
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Container>
        <Link href={'/'}>Home</Link>
        <Columns>
          <Column>
            <h1>ParentInput</h1>
            {renderTextInputs({
              label: 'Label',
              placeholder: 'With label',
              value: value,
              onChange: handleTextChange,
            })}
            {renderTextInputs({
              label: 'Label',
              isLabelBold: true,
              placeholder: 'With bold label',
              value: value,
              onChange: handleTextChange,
            })}
            {renderTextInputs({
              label: 'Label',
              sublabel: 'Sublabel',
              placeholder: 'With label and sublabel',
              value: value,
              onChange: handleTextChange,
            })}
          </Column>
          <Column>
            <h1>TextInput</h1>
            {renderTextInputs({
              placeholder: 'Simple input',
              value: value,
              onChange: handleTextChange,
            })}
            {renderTextInputs({
              placeholder: 'Error input',
              isError: true,
              value: value,
              onChange: handleTextChange,
            })}
            {renderTextInputs({
              placeholder: 'Disabled input',
              disabled: true,
              value: value,
              onChange: handleTextChange,
            })}
          </Column>
          <Column>
            <h1>TextInput with images</h1>
            {renderTextInputs({
              placeholder: 'Input with image',
              imageSrc: 'https://cdn.morning.fr/logos/logo_google.png',
              imageAlt: 'google logo',
              value: value,
              onChange: handleTextChange,
            })}
          </Column>
          <Column>
            <h1>NumberInput</h1>
            {renderNumberInputs({
              label: 'Simple',
              sublabel: 'Sublabel',
              value: numberValue,
              onChange: handleNumberChange,
            })}
            {renderNumberInputs({
              label: 'Error',
              isError: true,
              value: numberValue,
              onChange: handleNumberChange,
            })}
            {renderNumberInputs({
              label: 'Disabled',
              disabled: true,
              value: numberValue,
              onChange: handleNumberChange,
            })}
          </Column>
          <Column>
            <h1>TimeInput</h1>
            {renderTimeInputs({
              label: 'Normal',
              value: timeValue,
              onChange: handleTimeChange,
            })}
            {renderTimeInputs({
              label: 'Error',
              isError: true,
              value: timeValue,
              onChange: handleTimeChange,
            })}
            {renderTimeInputs({
              label: 'Disabled',
              disabled: true,
              value: timeValue,
              onChange: handleTimeChange,
            })}
            {renderTimeInputs({
              label: '> 8:00',
              min: '8:00',
              value: timeValue,
              onChange: handleTimeChange,
            })}
            {renderTimeInputs({
              label: '< 22:00',
              max: '22:00',
              value: timeValue,
              onChange: handleTimeChange,
            })}
            {renderTimeInputs({
              label: '8:00 < x < 22:00',
              min: '8:00',
              max: '22:00',
              value: timeValue,
              onChange: handleTimeChange,
            })}
          </Column>
        </Columns>
      </Container>
    </div>
  );
}
