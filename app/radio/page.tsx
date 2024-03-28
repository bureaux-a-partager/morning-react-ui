'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Size } from '@/utils/Enum';
import { SelectionState } from '@/components/inputs/types';
import Radio from '@/components/inputs/radio/Radio';
import MultiRadio from '@/components/inputs/radio/MultiRadio';
import Container from '@/components/layout/Container';
import Columns from '@/components/layout/Columns';
import Column from '@/components/layout/Column';

const RadioGroup = () => {
  const initialOptions = {
    option1: true,
    option2: false,
    option3: false,
  };

  const [valueRadio, setValueRadio] = useState<boolean>(true);
  const handleChange = (value: boolean) => {
    setValueRadio(!value);
  };

  const [options, setOptions] = useState<SelectionState>(initialOptions);

  const handleOptionsChange = (optionsModified: SelectionState) => {
    setOptions(optionsModified);
  };
  const renderRadio = (props: {
    label: string;
    size?: Size;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }) => {
    return (
      <>
        <Radio {...props} size={Size.xs} />
        <Radio {...props} size={Size.s} />
        <Radio {...props} size={Size.m} />
        <Radio {...props} size={Size.l} />
      </>
    );
  };

  const renderMultiRadio = (props: {
    label: string;
    size?: Size;
    options: SelectionState;
    onChange: (options: SelectionState) => void;
    disabled?: boolean;
    inline?: boolean;
  }) => {
    return (
      <>
        <MultiRadio {...props} label='MultiRadio xs' size={Size.xs} />
        <MultiRadio {...props} label='MultiRadio s' size={Size.s} />
        <MultiRadio {...props} label='MultiRadio m' size={Size.m} />
        <MultiRadio {...props} label='MultiRadio l' size={Size.l} />
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Container>
        <Link href={'/'}>Home</Link>
        <Columns>
          <Column>
            <h1>Radio</h1>
            {renderRadio({
              label: 'Label',
              value: valueRadio,
              onChange: handleChange,
            })}
            {renderRadio({
              label: 'Label',
              value: valueRadio,
              onChange: handleChange,
            })}
            {renderRadio({
              label: 'Label',
              value: valueRadio,
              onChange: handleChange,
              disabled: true,
            })}
          </Column>
          <Column>
            <h1>MultiRadio</h1>
            {renderMultiRadio({
              label: 'Label',
              options: options,
              onChange: handleOptionsChange,
              inline: true,
            })}
          </Column>
          <Column>
            <h1>Disabled</h1>
            {renderMultiRadio({
              label: 'Label',
              options: options,
              onChange: handleOptionsChange,
              disabled: true,
              inline: true,
            })}
          </Column>
        </Columns>
      </Container>
    </div>
  );
};

export default RadioGroup;
