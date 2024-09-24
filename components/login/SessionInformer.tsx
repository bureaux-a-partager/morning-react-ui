'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { Size } from 'morning-react-ui/utils/Enum';
import { Button, ButtonVariant } from '../buttons';
import Avatar from './Avatar';
import styles from './sessionInformer.module.css';

type SessionInformerProps = {
  session: Session;
  size?: number;
  signOut: () => void;
};

const SessionInformer = ({ session, size, signOut }: SessionInformerProps) => {
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (isDropdownDisplayed) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsDropdownDisplayed(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsDropdownDisplayed(true);
    }
  };

  const getImage = () => (
    <Image
      src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/power-off.svg`}
      alt='Power Off'
      width={size}
      height={size}
    />
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (isDropdownDisplayed) {
          setIsAnimating(true);
          setTimeout(() => {
            setIsDropdownDisplayed(false);
            setIsAnimating(false);
          }, 300);
        }
      }
    };

    if (isDropdownDisplayed) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownDisplayed]);

  if (session?.user) {
    return (
      <div className={styles.sessionInformer}>
        <div onClick={toggleDropdown} className={styles.wrapper}>
          {session?.user?.image && (
            <Avatar imageUrl={session.user.image} size={size} />
          )}
          <p className={styles.hide}>{session?.user?.email}</p>
        </div>
        {(isDropdownDisplayed || isAnimating) && (
          <div
            className={`${styles.dropdown} ${
              isAnimating ? styles.dropdownExit : styles.dropdownEnter
            }`}
            ref={wrapperRef}
          >
            <Button
              variant={ButtonVariant.Secondary}
              startImage={getImage()}
              onClick={() => signOut()}
              size={Size.l}
            >
              Se déconnecter
            </Button>
          </div>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default SessionInformer;
