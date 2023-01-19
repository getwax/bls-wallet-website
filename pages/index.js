import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Fade from 'react-reveal/Fade';
import { useEffect, useState } from 'react';
import { shuffled } from 'ethers/lib/utils';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import walletLogo from '../public/walletLogo.png';
import FeatureCard from '../components/FeatureCard';
import TeamMember from '../components/TeamMember';

export default function Home() {
  // Need to initially not shuffle to match server-side rendering
  const [shouldShuffle, setShouldShuffle] = useState(false);
  useEffect(() => setShouldShuffle(true), []);

  return (
    <>
      <Head>
        <title>BLS Wallet</title>
      </Head>
      <Header />
      <div className={styles.main}>
        <Fade bottom>
          <Image
            src={walletLogo}
            alt="an illustration of a wallet"
            width={200}
            height={200}
          />
          <h1 className={styles.title}>Reduce transaction fees on evm-L2s</h1>
          <p
            style={{
              maxWidth: '760px',
              fontSize: '20px',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            Compress transactions with BLS signature aggregation. Our smart
            contract wallet also introduces recovery, multi-action, gasless
            transactions and upgradeability.
          </p>
        </Fade>
        <span style={{ height: '40px' }} />
        <Fade bottom>
          <div className={styles.buttons}>
            <Link href="/demo">
              <div className={styles.button}>
                <div className={styles.buttonPrimary}>
                  <span>Try the demo</span>
                </div>
              </div>
            </Link>

            <Link href="https://github.com/web3well/bls-wallet">
              <div className={styles.button}>
                <div className={styles.buttonSecondary}>
                  <span>Github</span>
                </div>
              </div>
            </Link>
          </div>
        </Fade>
        <span style={{ height: '40px' }} />
        <div className={styles.features}>
          <FeatureCard
            title="Reduce transaction fees"
            description="The BLS Wallet module enables wallets to sign transactions with BLS Signatures. Aggregating them lowers gas fees for supporting wallets, and their users of layer 2 dApps."
            logoPath="/fee.svg"
          />
          <FeatureCard
            title="Social key recovery"
            description="Recover a BLS contract wallet via a nominated Ethereum address. This can be a multisig address, effectively enabling social recovery."
            logoPath="/key.svg"
          />
          {' '}
          <FeatureCard
            title="Smooth, multi-action UX"
            description="Boost conversion and engagement in your dApp with simpler transactions - no more pestering users with multiple prompts to sign transactions one-by-one."
            logoPath="/smooth.svg"
          />
          {' '}
          <FeatureCard
            title="Gasless transactions"
            description="Further simplify user onboarding with dApp-sponsored transactions. Users sign their dApp actions; dApps include a payment to tx.origin to reward those that pay the gas."
            logoPath="/gasless.svg"
          />
          {' '}
          <FeatureCard
            title="Wallet upgradeability"
            description="Using the TransparentProxy method, individual wallets can upgrade their implementation. Similarly, a wallet can nominate a new gateway to use to process its transactions. Full wallet upgradability, 100% user-controlled."
            logoPath="/upgrade.svg"
          />
        </div>
        <span style={{ height: '40px' }} />
        <Link href="/demo">
          <div className={styles.button}>
            <div className={styles.buttonPrimary}>
              <span>Try the demo</span>
            </div>
          </div>
        </Link>
        <span style={{ height: '40px' }} />
        <Fade bottom>
          <h2 style={{ textAlign: 'center', fontSize: '40px' }}>
            Meet the team
          </h2>
        </Fade>
        <span style={{ height: '40px' }} />
        <div className={styles.teamMembers}>
          {
            (shouldShuffle ? shuffled : echo)([
              <TeamMember
                name="Jacob Caban-Tomski"
                memberRole="Software Developer"
                picturePath="/jacob.png"
              />,
              <TeamMember
                name="Blake Duncan"
                memberRole="Software Developer"
                picturePath="/blake.png"
              />,
              <TeamMember
                name="John Guilding"
                memberRole="Software Developer"
                picturePath="/john.png"
              />,
              <TeamMember
                name="Kautuk Kundan"
                memberRole="Software Developer"
                picturePath="/kautuk.png"
              />,
              <TeamMember
                name="Andrew Morris"
                memberRole="Software Developer"
                picturePath="/andrew.png"
              />,
              <TeamMember
                name="James Zaki"
                memberRole="Project Lead"
                picturePath="/james.png"
              />,
            ])
          }
        </div>
        <span style={{ height: '40px' }} />
        <Link href="/demo">
          <div className={styles.button}>
            <div className={styles.buttonPrimary}>
              <span>Try the demo</span>
            </div>
          </div>
        </Link>
        <div style={{ height: '80px' }} />
        <p>
          BLS-Wallet is part of
          {' '}
          <a href="https://appliedzkp.org" rel="noreferrer" target="_blank">
            Privacy & Scaling Explorations (PSE)
          </a>
          , a multidisciplinary team supported by the Ethereum Foundation. PSE
          explores new use cases for zero knowledge proofs and other
          cryptographic primitives.
        </p>
      </div>
      <div style={{ height: '80px' }} />
    </>
  );
}

function echo(value) {
  return value;
}
