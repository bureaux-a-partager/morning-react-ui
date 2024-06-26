'use client';
import { ReactNode, CSSProperties } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

type HeaderProps = {
  title?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

const Header = ({ title, children, style }: HeaderProps) => {
  const router = useRouter();
  return (
    <header className={styles.bar} style={style}>
      <div className={styles.container}>
        <div className={styles.imageAndTitle}>
          <Image
            src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}logos/logo_morning_black.png`}
            alt='logo'
            width={90}
            height={22}
            style={{ marginTop: '3px', marginRight: '5px', cursor: 'pointer' }}
            onClick={() => router.push('/')}
          />
          <p>{title}</p>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </header>
  );
};

export default Header;
