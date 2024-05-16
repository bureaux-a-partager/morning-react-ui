'use client';
import LoginPage from 'morning-react-ui/components/login/LoginPage';
import { handleLogin } from 'morning-react-ui/utils/auth/handleAuthClientSide';

export default function Login() {
  return (
    <LoginPage
      onClick={() => handleLogin()}
      title='Se connecter à la librairie'
      body='Bienvenue sur la page de connexion de la librairie react Morning. Pour y accéder, veuillez vous connecter avec Google à votre compte Morning.'
    />
  );
}
