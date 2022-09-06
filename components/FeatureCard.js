import styles from './FeatureCard.module.css'
import Fade from 'react-reveal/Fade'

export default function FeatureCard(props) {
  return (
    <Fade bottom>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img src={props.logoPath} alt="logo" />
          <h3 className={styles.title}>{props.title}</h3>
        </div>
        <p>{props.description}</p>
      </div>
    </Fade>
  )
}
