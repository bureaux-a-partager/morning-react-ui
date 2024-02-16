import Image from 'next/image';
import styles from './GoogleLoginButton.module.css';

type Props = {
  onClick: () => void;
};

const GoogleLoginButton = ({ onClick }: Props) => (
  <button className={styles.googleLoginButton} onClick={onClick}>
    <Image src='/logos/logo_google.png' alt='Google logo' width={24} height={24} />
    <span>{'Se connecter avec Google'}</span>
  </button>
);

export default GoogleLoginButton;
