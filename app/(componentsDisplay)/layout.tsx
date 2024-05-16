import { ReactNode } from 'react';
import '../globals.css';
import { auth } from 'morning-react-ui/app/auth';
import Header from 'morning-react-ui/components/layout/Header';
import SessionInformer from 'morning-react-ui/components/login/SessionInformer';
import { handleLogout } from 'morning-react-ui/utils/auth/handleAuthClientSide';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Header title='librairie de composants'>
        {session && (
          <SessionInformer session={session} signOut={handleLogout} size={20} />
        )}
      </Header>
      {children}
    </>
  );
}
