import Image from 'next/image';
import styles from './avatar.module.css';

type AvatarProps = {
  imageUrl: string;
  size?: number;
};

const Avatar = ({ imageUrl, size = 40 }: AvatarProps) => {
  return (
    <Image
      src={imageUrl}
      alt='Avatar'
      className={styles.image}
      width={size}
      height={size}
    />
  );
};

export default Avatar;
