'use client';

import { useState } from 'react';
import Image from 'next/image';
import Container from 'morning-react-ui/components/layout/Container';
import Navigation from 'morning-react-ui/components/layout/Navigation';
import Row from 'morning-react-ui/components/layout/Row';
import { UploadFile } from 'morning-react-ui/components/upload';

const UploadPage = () => {
  const [firstFile, setFirstFile] = useState<string | undefined>(undefined);
  const [secondFile, setSecondFile] = useState<string>(
    'morning-react-ui-data/images/login_background.jpeg',
  );
  const [thirdFile, setThirdFile] = useState<string | undefined>(undefined);

  return (
    <>
      <Navigation>
        <h1 className={'font-size-xl'}>Upload page</h1>
      </Navigation>
      <Container>
        <h2 className={'font-size-l'}>Upload Files</h2>
        <Row style={{ height: '240px', marginInline: '10%' }}>
          <UploadFile
            buttonLabel={'Ajouter un fichier'}
            destinationBucket={'react-ui-tests'}
            destinationPath={'uploads/'}
            onChange={setFirstFile}
            fileUrl={
              firstFile && `https://cdn.morning.fr/resize/500/300/${firstFile}`
            }
          ></UploadFile>
          <UploadFile
            buttonLabel={'remplacer cette image'}
            destinationBucket={'react-ui-tests'}
            destinationPath={'uploads'}
            fileUrl={
              secondFile &&
              `https://cdn.morning.fr/resize/500/300/${secondFile}`
            }
            onChange={setSecondFile}
          ></UploadFile>
        </Row>
        <Row style={{ background: 'var(--cloud)' }}>
          <Row
            style={{
              height: '240px',
              width: '700px',
              margin: '0 auto',
              padding: '8px 10%',
            }}
          >
            <UploadFile
              buttonLabel={
                'Ajouter une image de couverture, seulement une image'
              }
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads/'}
              onChange={setThirdFile}
              fileUrl={
                thirdFile &&
                `https://cdn.morning.fr/resize/500/300/${thirdFile}`
              }
              fileType={'image/*'}
            ></UploadFile>
          </Row>
        </Row>
        <Row style={{ height: '240px', marginInline: '10%' }}>
          <UploadFile
            isError={true}
            buttonLabel={'Exemple erreur'}
            destinationBucket={'react-ui-tests'}
            destinationPath={'uploads/'}
            onChange={setFirstFile}
            fileUrl={
              firstFile && `https://cdn.morning.fr/resize/500/300/${firstFile}`
            }
          ></UploadFile>
          <UploadFile
            buttonLabel={'Charger un fichier plus gros < 20Mo'}
            destinationBucket={'react-ui-tests'}
            destinationPath={'uploads/'}
            onChange={setFirstFile}
            fileUrl={
              firstFile && `https://cdn.morning.fr/resize/500/300/${firstFile}`
            }
            maxFileSize={20}
            maxSizeErrorMessage={'On pensait que 20Mo était large.'}
          ></UploadFile>
          <UploadFile
            buttonLabel={'Charger un petit fichier <1mo'}
            destinationBucket={'react-ui-tests'}
            destinationPath={'uploads/'}
            onChange={setFirstFile}
            fileUrl={
              firstFile && `https://cdn.morning.fr/resize/500/300/${firstFile}`
            }
            maxFileSize={1}
            maxSizeErrorMessage={
              'Le fichier envoyé dépasse la limite de 1Mo, sorry bro.'
            }
          ></UploadFile>
        </Row>
        <Row>
          <h3>mes fichiers</h3>
          <dl>
            <dt>Premier</dt>
            <dd>
              {firstFile}
              <Image
                src={`https://cdn.morning.fr/resize/800/400/${firstFile}`}
                alt={'premier fichier'}
                width={500}
                height={400}
              />
            </dd>
            <dt>Deuxième</dt>
            <dd>{secondFile}</dd>
          </dl>
        </Row>
      </Container>
    </>
  );
};

export default UploadPage;
