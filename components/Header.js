import styles from './Header.module.css'
import Image from 'next/image'
import discordLogo from '../public/discordLogo.svg'
import githubLogo from '../public/githubHeaderLogo.svg'
import Link from 'next/link'

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href="/">
        <a>
          <span className={styles.headerTitle}>BLS Wallet</span>
        </a>
      </Link>
      <div className={styles.logoLinks}>
        <Link href="https://discord.gg/hGDmAhcRyz">
          <a
            className={styles.logoLink}
            style={{ position: 'relative', top: '1px' }}
            target="_blank"
          >
            <Image src={discordLogo} alt="discord logo" />
          </a>
        </Link>
        <Link href="https://github.com/web3well/bls-wallet">
          <a className={styles.logoLink} target="_blank">
            <Image src={githubLogo} alt="github logo" />
          </a>
        </Link>
      </div>
    </div>
  )
}
