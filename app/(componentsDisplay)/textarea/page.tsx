'use client';
import { useState } from 'react';
import RichText from 'morning-react-ui/components/inputs/richText/RichText';
import Column from 'morning-react-ui/components/layout/Column';
import Columns from 'morning-react-ui/components/layout/Columns';
import Container from 'morning-react-ui/components/layout/Container';
import Navigation from 'morning-react-ui/components/layout/Navigation';
import { stripHtml } from 'morning-react-ui/utils';

const Page = () => {
  const [textArea, setTextArea] = useState<string>('');

  return (
    <>
      <Navigation>
        <h1 className={'font-size-xl'}>Rich Text Area</h1>
      </Navigation>
      <Container>
        <Columns>
          <Column>
            <RichText
              value={textArea}
              onChange={(e) => setTextArea(e.currentTarget.value)}
              placeholder='Le placeholder'
              label='Text area'
            />
          </Column>
          <Column>
            <div
              dangerouslySetInnerHTML={{ __html: textArea }}
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '590px',
              }}
            ></div>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <RichText
              value={textArea}
              onChange={(e) => setTextArea(e.currentTarget.value)}
              placeholder='Le placeholder'
              label='Text area not empty'
              isError={stripHtml(textArea).length === 0}
            />
          </Column>
          <Column></Column>
        </Columns>
        <Columns>
          <Column>
            <RichText
              value={textArea}
              onChange={(e) => setTextArea(e.currentTarget.value)}
              placeholder='Le placeholder'
              label='Text area with max'
              sublabel={`${stripHtml(textArea).length}/150`}
              maxCharacter={150}
              isError={stripHtml(textArea).length > 150}
            />
          </Column>
          <Column>{textArea}</Column>
        </Columns>
        <Columns>
          <Column>
            <RichText
              value={textArea}
              onChange={(e) => setTextArea(e.currentTarget.value)}
              placeholder='Le placeholder'
              label='Text area disabled'
              disabled
            />
          </Column>
          <Column></Column>
        </Columns>
      </Container>
    </>
  );
};

export default Page;
