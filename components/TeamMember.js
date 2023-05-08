import Image from 'next/image';
import Fade from 'react-reveal/Fade';
import styles from './TeamMember.module.css';

export default function TeamMember(props) {
  const { name, memberRole, picturePath } = props;
  return (
    <Fade bottom>
      <div className={styles.card}>
        <Image
          className={styles.cardImage}
          src={picturePath}
          alt={`Headshot of WAX team member, ${name}`}
          width={120}
          height={120}
        />
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <span className={styles.name}>{name}</span>
            <span className={styles.role}>{memberRole}</span>
          </div>
        </div>
      </div>
      {' '}
    </Fade>
  );
}
