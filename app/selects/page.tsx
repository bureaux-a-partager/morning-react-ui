'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MultiSelect from '@/components/inputs/selects/MultiSelect';
import { SelectionState } from '@/components/inputs/types';
import Container from '@/components/layout/Container';
import Columns from '@/components/layout/Columns';
import Column from '@/components/layout/Column';

export default function Login() {
  const initialOptions = {
    option1: false,
    option2: false,
    option3: false,
    test1: false,
  };
  const [options, setOptions] = useState<SelectionState>(initialOptions);

  useEffect(() => {
    //console.log(options);
  }, [options]);

  return (
    <Container>
      <Link href={'/'}>Home</Link>
      <Columns>
        <Column>
          {Object.entries(options).map(([key, value], index) => (
            <span key={index} style={{ marginRight: '10px' }}>
              {key}: {value.toString()}
            </span>
          ))}
          <MultiSelect options={options} onChange={setOptions} />
        </Column>
        <Column>
          <MultiSelect options={options} onChange={setOptions} />
        </Column>
      </Columns>
    </Container>
  );
}
