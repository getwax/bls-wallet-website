import styles from './TeamMember.module.css'
import Link from 'next/link'
import Fade from 'react-reveal/Fade'

export default function TeamMember(props) {
  return (
    <Fade bottom>
      <div className={styles.card}>
        <img
          className={styles.cardImage}
          src={props.picturePath}
          alt="A picture of a team member of BLS wallet"
        />
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <span className={styles.name}>{props.name}</span>
            <span className={styles.role}>{props.role}</span>
          </div>
        </div>
      </div>{' '}
    </Fade>
  )
}
