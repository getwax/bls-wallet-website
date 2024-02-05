import Head from 'next/head';
import Image from 'next/image';
import { Fade } from 'react-awesome-reveal';
import { useEffect, useState } from 'react';
import { shuffled } from 'ethers/lib/utils';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import waxGreenLogo from '../public/waxGreenLogo.png';
import TeamMember from '../components/TeamMember';

export default function Home() {
  // Need to initially not shuffle to match server-side rendering
  const [shouldShuffle, setShouldShuffle] = useState(false);
  useEffect(() => setShouldShuffle(true), []);

  return (
    <>
      <Head>
        <title>WAX</title>
      </Head>
      <Header />
      <div className={styles.main}>
        <Fade bottom>
          <Image
            src={waxGreenLogo}
            alt="an illustration of a wallet"
            width={500}
            height={200}
            priority
          />
          <h1 className={styles.title}>
            Wallet Account eXperiments
          </h1>
          <p
            style={{
              maxWidth: '760px',
              fontSize: '20px',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            Helping wallets, dapps, and SDKs shine.
          </p>
        </Fade>
        <span style={{ height: '40px' }} />
        <Fade bottom>
          <div className={styles.buttons}>
            <a
              href="https://wax-demo.org/"
              target="_blank"
              rel="noreferrer"
              className={styles.button}
            >
              <div className={styles.buttonPrimary}>
                <span>WAX demo</span>
              </div>
            </a>
            <a
              href="https://github.com/getwax"
              target="_blank"
              rel="noreferrer"
              className={styles.button}
            >
              <div className={styles.buttonSecondary}>
                <span>Github</span>
              </div>
            </a>
          </div>
        </Fade>
        <span style={{ height: '40px' }} />

        <Fade bottom>
          <div className={styles.contentContainer}>
            <h2>Why WAX</h2>
            <p>
              Using cryptographic primitives in smart accounts can be
              as hard as finding them in the first place. Research and
              development of such primitives is even harder. WAX integrates
              components developed by PSE for use in a 4337 smart account.
              The goal is to empower wallets, dapps and SDKs more readily,
              and thus improve the experience of Ethereum account-holders.
            </p>
            <p>
              For example, cheaper layer-2 transactions are unlocked via use
              of proven signature schemes (BLS) combined with calldata compression
              strategies. Or better and safer UX with choices in verification
              methods using zero-knowledge proofs (coming soon). These
              advantages can be brought into more products without each
              entity doing their own R&D.
            </p>
          </div>
        </Fade>
        <Fade bottom>
          <div className={styles.aaCapabilities}>
            <h2>New smart account capabilities...</h2>
            <ul>
              <li>
                Lower fees with calldata compression
                <ul>
                  <li>Additionally BLS sig aggregation for L2s</li>
                </ul>
              </li>
              <li>
                Passkey validation
                <ul>
                  <li>Uses WebAuthn standard</li>
                </ul>
              </li>
              <li>Recovery of a validation mechaism via hidden guardian(s)</li>
              <li>Multiple actions in a single UserOperation</li>
              <li>Email validation of UserOps via ZK Email primitive (aspirational)</li>
            </ul>
          </div>
        </Fade>
        <Fade bottom>
          <div className={styles.contentContainer}>
            <h2>How WAX works</h2>
            <p>
              With the advent of the ERC4337 Account Abstraction standard,
              and development of novel zk verification methods from PSE
              groups, WAX seeks to integrate and showcase novel examples.
              Integration of verification primitives is done in a modular way,
              initially using SAFE modules and plugin design, but we will
              keep an eye on how AA modular standards like ERC6900 settle.
            </p>
            <p>
              These Wallet Account eXperiments are WAX.
            </p>
            <p>
              At a higher level these components are brought together in
              an easy-to-use library, making it easier for others to understand and integrate.
            </p>
          </div>
        </Fade>
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
                name="Jake C-T"
                memberRole="Project Lead"
                picturePath="/jake.png"
                key="jake"
              />,
              <TeamMember
                name="John Guilding"
                memberRole="Software Developer"
                picturePath="/john.png"
                key="john"
              />,
              <TeamMember
                name="Andrew Morris"
                memberRole="Software Developer"
                picturePath="/andrew.png"
                key="andrew"
              />,
            ])
          }
        </div>
        <div style={{ height: '80px' }} />
        <p>
          Wallet Account eXperiments (WAX) is part of
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
