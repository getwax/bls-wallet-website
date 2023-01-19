import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import discordLogo from '../public/discordLogo.svg';
import githubLogo from '../public/githubHeaderLogo.svg';

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href="/">
        <span className={styles.headerTitle}>BLS Wallet</span>
      </Link>
      <div className={styles.logoLinks}>
        <a
          className={styles.logoLink}
          style={{ position: 'relative', top: '1px' }}
          target="_blank"
          href="https://discord.gg/hGDmAhcRyz"
          rel="noreferrer"
        >
          <Image src={discordLogo} alt="discord logo" />
        </a>
        <a
          className={styles.logoLink}
          target="_blank"
          href="https://github.com/web3well/bls-wallet"
          rel="noreferrer"
        >
          <Image src={githubLogo} alt="github logo" />
        </a>
      </div>
    </div>
  );
}
