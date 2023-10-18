import Head from 'next/head';
import Image from 'next/image';
import { Fade } from 'react-awesome-reveal';
import { useEffect, useState } from 'react';
import { shuffled } from 'ethers/lib/utils';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import waxGreenLogo from '../public/waxGreenLogo.png';
import FeatureCard from '../components/FeatureCard';
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
            <h2>Why WAX (formerly BLS Wallet)</h2>
            <p>
              Using cryptographic primitives in a meaningful way can
              be as hard as finding them in the first place. Research
              and development of such primitives is even harder.
              WAX integrates components developed by PSE, to
              empower wallets, dapps and SDKs to readily improve
              the experience of Ethereum account-holders.
            </p>
            <p>
              For example, cheaper layer-2 transactions are unlocked
              via use of proven signature schemes (BLS). Or better and
              safer UX with choices in verification methods
              using zero-knowledge proofs (coming soon). These
              advantages can be brought into more products without
              each entity doing their own R&D.
            </p>
          </div>
        </Fade>

        <Fade bottom>
          <div className={styles.contentContainer}>
            <h2>How WAX works</h2>
            <p>
              Cheaper transactions (and smart recovery) were achieved
              by leveraging BLS Signature aggregation via: bespoke
              smart contracts, client code, and a demo wallet extension
              (formerly ‘BLS Wallet’). This was integrated as a prototype
              into a popular L2 network.
            </p>
            <p>
              With the advent of a new Account Abstraction standard (ERC4337),
              and development of novel zk verification methods (from PSE),
              the next version of smart contracts builds from a familiar/proven
              contract foundation. On top of this we will be adding new
              verification components to the existing BLS one, and showcasing
              integrations for better ux for Ethereum account holders. These
              Wallet Account eXperiments are WAX.
            </p>
            <p>
              At a higher level WAX components are brought together
              in an easy-to-use node module, EthDK.
            </p>
          </div>
        </Fade>

        {/* Feature section */}
        <h2>Key Features</h2>
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
                key="jacob"
              />,
              <TeamMember
                name="Blake Duncan"
                memberRole="Software Developer"
                picturePath="/blake.png"
                key="blake"
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
              <TeamMember
                name="James Zaki"
                memberRole="Project Lead"
                picturePath="/james.png"
                key="james"
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
