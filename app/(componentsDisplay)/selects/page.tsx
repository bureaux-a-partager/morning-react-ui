'use client';
import { useState } from 'react';
import MultiSelect from 'morning-react-ui/components/inputs/selects/MultiSelect';
import SelectInput from 'morning-react-ui/components/inputs/selects/SelectInput';
import NumberInput from 'morning-react-ui/components/inputs/textField/NumberInput';
import Column from 'morning-react-ui/components/layout/Column';
import Columns from 'morning-react-ui/components/layout/Columns';
import Container from 'morning-react-ui/components/layout/Container';
import Navigation from 'morning-react-ui/components/layout/Navigation';
import { SelectionState } from 'morning-react-ui/types';
import { Size } from 'morning-react-ui/utils/Enum';

export default function Selects() {
  const initialOptions = {
    Amsterdam: false,
    Argentine: false,
    Auber: false,
    Balard: false,
    Bayard: false,
    Beaurepaire: false,
    Boissière: false,
    Bourse: false,
    Caire: false,
    Cambacérès: false,
    Cléry: false,
    Concorde: false,
    'Faubourg Saint-Honoré': false,
    Gallieni: false,
    Iéna: false,
    'La Défense': false,
    Laffitte: false,
    Miromesnil: false,
    Mogador: false,
    Monceau: false,
    Montparnasse: false,
    Montsouris: false,
    'Neuilly Charles de Gaulle': false,
    'Neuilly Hôtel de Ville': false,
    Penthièvre: false,
    Pereire: false,
    "Pont de l'Alma": false,
    'Pont de Neuilly': false,
    'République-Boulanger': false,
    'Saint Ouen': false,
    'Saint-Augustin': false,
    Stalingrad: false,
    Trévise: false,
    Trocadéro: false,
    Vivienne: false,
    '54 Petites Écuries / RATP': false,
    Cadet: false,
    Clichy: false,
    Duhesme: false,
    Dulong: false,
    Dussoubs: false,
    'Ledru-Rollin': false,
    'Petites Écuries': false,
    Sentier: false,
    Toudic: false,
    Victoires: false,
  };
  const [optionsToDisplay, setOptionsToDisplay] = useState(8);
  const [options, setOptions] = useState<SelectionState>(initialOptions);
  const [selectValue, setSelectValue] = useState<string>('');

  const handleSelectChange = (newSelectValue: string) => {
    setSelectValue(newSelectValue);
  };

  const renderSelectInputs = (props: {
    label?: string;
    sublabel?: string;
    isLabelBold?: boolean;
    size?: Size;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
    isError?: boolean;
    selectedOption: string;
    onChange: (value: string) => void;
  }) => {
    return (
      <>
        <SelectInput {...props} size={Size.xs} />
        <SelectInput {...props} size={Size.s} />
        <SelectInput {...props} size={Size.m} />
        <SelectInput {...props} size={Size.l} />
      </>
    );
  };

  const renderMultiSelectInputs = (props: {
    label?: string;
    sublabel?: string;
    isLabelBold?: boolean;
    size?: Size;
    options: SelectionState;
    placeholder?: string;
    disabled?: boolean;
    isError?: boolean;
    onChange: (value: SelectionState) => void;
    rowToDisplay?: number;
  }) => {
    return (
      <>
        <MultiSelect {...props} size={Size.xs} />
        <MultiSelect {...props} size={Size.s} />
        <MultiSelect {...props} size={Size.m} />
        <MultiSelect {...props} size={Size.l} />
      </>
    );
  };

  return (
    <>
      <Navigation>
        <h1 className={'font-size-xl'}>Selects</h1>
      </Navigation>
      <Container style={{ gap: '30px' }}>
        <NumberInput
          label='Elements displayed in the dropdown'
          value={optionsToDisplay}
          onChange={setOptionsToDisplay}
          min={1}
        />
        <Columns>
          <Column>
            <h1>MultiSelect</h1>
            {renderMultiSelectInputs({
              label: 'Simple',
              sublabel: 'Sublabel',
              placeholder: 'Placeholder',
              options: options,
              onChange: setOptions,
              rowToDisplay: optionsToDisplay,
            })}
            {renderMultiSelectInputs({
              label: 'Simple',
              sublabel: 'Sublabel',
              placeholder: 'Placeholder',
              options: options,
              onChange: setOptions,
              rowToDisplay: optionsToDisplay,
              disabled: true,
            })}
            {renderMultiSelectInputs({
              label: 'Simple',
              sublabel: 'Sublabel',
              placeholder: 'Placeholder',
              options: options,
              onChange: setOptions,
              rowToDisplay: optionsToDisplay,
              isError: true,
            })}
          </Column>
          <Column>
            <h1>SelectInput</h1>
            {renderSelectInputs({
              label: 'Simple',
              sublabel: 'Sublabel',
              placeholder: 'Placeholder',
              options: ['one', 'two', 'three', 'four', 'five'],
              selectedOption: selectValue,
              onChange: handleSelectChange,
            })}
            {renderSelectInputs({
              label: 'Disabled',
              sublabel: 'Sublabel',
              placeholder: 'Placeholder',
              options: ['one', 'two', 'three', 'four', 'five'],
              disabled: true,
              selectedOption: selectValue,
              onChange: handleSelectChange,
            })}
            {renderSelectInputs({
              label: 'Disabled',
              sublabel: 'Sublabel',
              placeholder: 'Placeholder',
              options: ['one', 'two', 'three', 'four', 'five'],
              isError: true,
              selectedOption: selectValue,
              onChange: handleSelectChange,
            })}
          </Column>
        </Columns>
      </Container>
    </>
  );
}
