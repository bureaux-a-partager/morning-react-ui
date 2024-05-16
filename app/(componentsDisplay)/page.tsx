'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonVariant } from 'morning-react-ui/components/buttons';
import Container from 'morning-react-ui/components/layout/Container';

export default function Home() {
  const router = useRouter();
  return (
    <Container style={{ gap: '10px' }}>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/buttons')}
      >
        Buttons
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/inputs')}
      >
        Inputs
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/selects')}
      >
        Selects
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/checkbox')}
      >
        Checkbox
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/datetime')}
      >
        Date & Time
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/radio')}
      >
        Radio
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/utils')}
      >
        Utils
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/upload')}
      >
        Upload
      </Button>
      <Button
        variant={ButtonVariant.Secondary}
        onClick={() => router.push('/textarea')}
      >
        Textarea
      </Button>
    </Container>
  );
}
