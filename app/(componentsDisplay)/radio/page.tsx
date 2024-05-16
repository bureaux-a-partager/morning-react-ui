'use client';
import { useState } from 'react';
import MultiRadio from 'morning-react-ui/components/inputs/toggleInputs/MultiRadio';
import Radio from 'morning-react-ui/components/inputs/toggleInputs/single/Radio';
import Column from 'morning-react-ui/components/layout/Column';
import Columns from 'morning-react-ui/components/layout/Columns';
import Container from 'morning-react-ui/components/layout/Container';
import Navigation from 'morning-react-ui/components/layout/Navigation';
import { SelectionState } from 'morning-react-ui/types/dataTypes';
import { Size } from 'morning-react-ui/utils/Enum';

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
    <>
      <Navigation>
        <h1 className={'font-size-xl'}>Radio</h1>
      </Navigation>
      <Container>
        <h1>Radio</h1>
        <Columns>
          <Column>
            <h3>Single radio</h3>
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
            <h3>MultiRadio</h3>
            {renderMultiRadio({
              label: 'Label',
              options: options,
              onChange: handleOptionsChange,
              inline: false,
            })}
          </Column>
          <Column>
            <h1>MultiRadio disabled</h1>
            {renderMultiRadio({
              label: 'Label',
              options: options,
              onChange: handleOptionsChange,
              inline: false,
              disabled: true,
            })}
          </Column>
          <Column>
            <h3>Multiradio inline</h3>
            {renderMultiRadio({
              label: 'Label',
              options: options,
              onChange: handleOptionsChange,
              inline: true,
            })}
            <h3>Multiradio inline disabled</h3>
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
    </>
  );
};

export default RadioGroup;
