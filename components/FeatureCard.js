import Fade from 'react-reveal/Fade';
import styles from './FeatureCard.module.css';

export default function FeatureCard(props) {
  const { title, description, logoPath } = props;
  return (
    <Fade bottom>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img src={logoPath} alt="logo" />
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </Fade>
  );
}
