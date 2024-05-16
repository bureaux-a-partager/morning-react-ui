'use client';
import { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

type HeaderProps = {
  title?: string;
  children?: ReactNode;
};

const Header = ({ title, children }: HeaderProps) => {
  const router = useRouter();
  return (
    <header className={styles.bar}>
      <div className={styles.container}>
        <Image
          src='https://cdn.morning.fr/logos/logo_morning_black.png'
          alt='logo'
          width={90}
          height={22}
          style={{ marginTop: '3px', marginRight: '5px', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        />
        <p>{title}</p>
        <div className={styles.children}>{children}</div>
      </div>
    </header>
  );
};

export default Header;
