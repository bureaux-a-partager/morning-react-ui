'use client';
import Image from 'next/image';
import styles from './emptyState.module.css';

type EmptyStateProps = {
  imageSrc: string;
  text?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  imageSrc,
  text = '',
  imageWidth = 162,
  imageHeight = 126,
}: EmptyStateProps) => {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt='empty'
          width={imageWidth}
          height={imageHeight}
        />
      </div>
      <p className={styles.emptyStateText}>{text}</p>
    </div>
  );
};

export default EmptyState;
