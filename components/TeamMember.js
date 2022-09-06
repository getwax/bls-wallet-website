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
          <hr style={{ width: '100%' }} />
          <div className={styles.links}>
            {props.twitter && (
              <Link href={props.twitter}>
                <a className={styles.logoLink} target="_blank">
                  <img src="/twitterLogo.svg" alt="Twitter logo" />
                </a>
              </Link>
            )}
            {props.telegram && (
              <Link href={props.telegram}>
                <a className={styles.logoLink} target="_blank">
                  <img src="/telegramLogo.svg" alt="telegram logo" />
                </a>
              </Link>
            )}
            {props.github && (
              <Link href={props.github}>
                <a className={styles.logoLink} target="_blank">
                  <img src="/githubLogo.svg" alt="github logo" />
                </a>
              </Link>
            )}
            {props.discord && (
              <Link href={props.discord}>
                <a className={styles.logoLink} target="_blank">
                  <img src="/discordLogo.svg" alt="discord logo" />
                </a>
              </Link>
            )}
            {props.linkedIn && (
              <Link href={props.linkedIn}>
                <a className={styles.logoLink} target="_blank">
                  <img src="/linkedInLogo.svg" alt="linkedIn logo" />
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>{' '}
    </Fade>
  )
}
