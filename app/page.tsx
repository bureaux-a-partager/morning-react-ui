'use client';

import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button, ButtonVariant } from '@/components/buttons';

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
        onClick={() => router.push('/utils')}
      >
        Utils
      </Button>
    </Container>
  );
}
