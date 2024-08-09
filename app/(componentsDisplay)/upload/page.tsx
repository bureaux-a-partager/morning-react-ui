'use client';

import { useState } from 'react';
import Image from 'next/image';
import Column from 'morning-react-ui/components/layout/Column';
import Columns from 'morning-react-ui/components/layout/Columns';
import Container from 'morning-react-ui/components/layout/Container';
import Navigation from 'morning-react-ui/components/layout/Navigation';
import { UploadFile } from 'morning-react-ui/components/upload';
import styles from './upload.module.css';

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
        <Columns>
          <Column>
            <UploadFile
              label={'Upload File'}
              sublabel={'Upload File tips and more'}
              buttonLabel={'Ajouter un fichier'}
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads/'}
              onChange={setFirstFile}
              className={styles.size}
              fileUrl={
                firstFile &&
                `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}500/300/${firstFile}`
              }
            ></UploadFile>
          </Column>
          <Column>
            <UploadFile
              buttonLabel={'remplacer cette image'}
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads'}
              fileUrl={
                secondFile &&
                `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}resize/500/300/${secondFile}`
              }
              onChange={setSecondFile}
              className={styles.size}
            ></UploadFile>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <UploadFile
              label={'Photo de le évènement trop bien'}
              sublabel={
                'Taille recommandée: entre 2 Mo et 10 Mo max. Le ratio est de 2:1'
              }
              buttonLabel={
                'Ajouter une image de couverture, seulement une image'
              }
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads/'}
              onChange={setThirdFile}
              fileUrl={thirdFile && `/resize/500/300/${thirdFile}`}
              fileType={'image/*'}
              className={styles.surrounded}
            ></UploadFile>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <UploadFile
              isError={true}
              buttonLabel={'Exemple erreur'}
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads/'}
              onChange={setFirstFile}
              fileUrl={
                firstFile &&
                `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}resize/500/300/${firstFile}`
              }
              className={styles.size}
            ></UploadFile>
          </Column>
          <Column>
            <UploadFile
              buttonLabel={'Charger un fichier plus gros < 20Mo'}
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads/'}
              onChange={setFirstFile}
              fileUrl={
                firstFile &&
                `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}resize/500/300/${firstFile}`
              }
              maxFileSize={20}
              maxSizeErrorMessage={'On pensait que 20Mo était large.'}
              className={styles.size}
            ></UploadFile>
          </Column>
          <Column>
            <UploadFile
              buttonLabel={'Charger un petit fichier <1mo'}
              destinationBucket={'react-ui-tests'}
              destinationPath={'uploads/'}
              onChange={setFirstFile}
              fileUrl={
                firstFile &&
                `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}resize/500/300/${firstFile}`
              }
              maxFileSize={1}
              maxSizeErrorMessage={
                'Le fichier envoyé dépasse la limite de 1Mo, sorry bro.'
              }
              className={styles.size}
            ></UploadFile>
          </Column>
        </Columns>
        <Columns>
          <h3>mes fichiers</h3>
          <dl>
            <dt>Premier</dt>
            <dd>
              {firstFile}
              <Image
                src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}resize/800/400/${firstFile}`}
                alt={'premier fichier'}
                width={500}
                height={400}
              />
            </dd>
            <dt>Deuxième</dt>
            <dd>{secondFile}</dd>
          </dl>
        </Columns>
      </Container>
    </>
  );
};

export default UploadPage;
