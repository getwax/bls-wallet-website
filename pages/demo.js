import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Aggregator, BlsWalletWrapper } from 'bls-wallet-clients'
import Fade from 'react-reveal'
import Swal from 'sweetalert2'

import { NETWORKS, ERC20_ADDRESS, SPENDER_CONTRACT_ADDRESS } from '../constants';

export default function Demo() {
  // Create a private key
  const [privateKey] = useState(
    ethers.Wallet.createRandom().privateKey,
  )
  const [wallet, setWallet] = useState(false)
  const [balance, setBalance] = useState('0.0')
  const [balanceChanging, setBalanceChanging] = useState(true)
  const [firstMint, setFirstMint] = useState(false)

  // Default network is Goerli
  const network = NETWORKS.arbitrumGoerli;
  const erc20Address = ERC20_ADDRESS.arbitrumGoerli;

  // Initiate the provider
  const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);

  // Connect to the token contract that Kautuk deployed and store it in state
  const erc20Abi = [
    'function mint(address _account, uint256 _amount)',
    'function balanceOf(address) view returns (uint)',
    'function approve(address _account, uint256 _amount)',
  ]
  const erc20 = new ethers.Contract(erc20Address, erc20Abi, provider);

  const spenderContractAbi = [
    'function pullTokens(address _account,uint256 _amount)',
  ]
  const spenderContract = new ethers.Contract(SPENDER_CONTRACT_ADDRESS.arbitrumGoerli, spenderContractAbi, provider);

  // We want to generate the wallet only once so we do so within a useEffect() hook, without any dependencies so it doesn't re-run
  useEffect(() => {
    // Generate a temporary BLS wallet using the private key, provider and verification gateway
    const intialiseWallet = async () => {
      const generatedWallet = await BlsWalletWrapper.connect(
        privateKey,
        network.verificationGateway,
        provider,
      )
      setWallet(generatedWallet)
    }
    intialiseWallet()
    // Call the token contract to mint some tokens
  }, [])

  useEffect(() => {
    if (wallet) {
      mint()
    }
  }, [wallet])

  const pollBalance = async () => {
    if (!wallet) {
      return null;
    }
    const originalBalance = balance
    const interval = setInterval(async function () {
      console.log('polling...')
      console.log(`original balance is ${balance}`)
      const fetchedBalance = ethers.utils.formatEther(
        await erc20.balanceOf(wallet.address),
      )
      console.log(`polled balance is ${fetchedBalance}`)
      if (fetchedBalance !== originalBalance) {
        console.log('balance updated.')
        setBalance(fetchedBalance)
        setBalanceChanging(false)
        setFirstMint(true)
        clearInterval(interval)
      }
    }, 2000)
    setTimeout(() => {
      if (!balanceChanging) {
        return null;
      }
      console.log('timing out')
      setBalanceChanging(false)
      clearInterval(interval)
      Swal.fire({
        icon: 'error',
        title: 'Transaction failed',
        text: 'Please try again',
        confirmButtonText: 'Reload page',
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload()
        }
      })
    }, 100000)
  }

  const mint = async () => {
    console.log('minting...')
    setBalanceChanging(true)
    const nonce = await BlsWalletWrapper.Nonce(
      wallet.PublicKey(),
      network.verificationGateway,
      provider,
    )
    const bundle = wallet.sign({
      nonce: nonce,
      actions: [
        {
          ethValue: 0,
          contractAddress: erc20.address,
          encodedFunction: erc20.interface.encodeFunctionData('mint', [
            wallet.address,
            ethers.BigNumber.from(10).pow(20),
          ]),
        },
      ],
    })
    const aggregator = new Aggregator(network.aggregatorUrl);
    console.log(await aggregator.add(bundle))
    console.log('mint tx submitted')
    pollBalance()
  }

  // On a frontend event, create a transaction
  const approveAndPullTokens = async () => {
    console.log('approving / pulling...')
    setBalanceChanging(true)
    const nonce = await BlsWalletWrapper.Nonce(
      wallet.PublicKey(),
      network.verificationGateway,
      provider,
    )
    console.log(`nonce is ${nonce}`)
    const bundle = wallet.sign({
      nonce: nonce,
      actions: [
        {
          ethValue: 0,
          contractAddress: erc20.address,
          encodedFunction: erc20.interface.encodeFunctionData('approve', [
            spenderContract.address,
            ethers.BigNumber.from(10).pow(18),
          ]),
        },
        {
          ethValue: 0,
          contractAddress: spenderContract.address,
          encodedFunction: spenderContract.interface.encodeFunctionData(
            'pullTokens',
            [erc20Address, ethers.BigNumber.from(10).pow(18)],
          ),
        },
      ],
    })
    console.log('bundle is:')
    console.log(bundle)
    console.log('logging aggregator')
    const aggregator = new Aggregator(network.aggregatorUrl);
    console.log(await aggregator.add(bundle))
    console.log('approval / pull txs submitted')
    // Store transfer success / failure in state to be represented in the frontend
    pollBalance()
  }

  return (
    <>
      <Head>
        <title>BLS Wallet</title>
      </Head>
      <Header />
      <div className={styles.main}>
        <h1>See the BLS Wallet in action:</h1>
        <span style={{ height: '40px' }} />
        <Fade bottom>
          <div style={{ position: 'relative', width: '100%' }}>
            {!wallet.address && (
              <h3>
                Please wait while we create your BLS wallet on the Goerli
                Testnet.
              </h3>
            )}
            {wallet.address && !firstMint && (
              <h3>
                We created a BLS Wallet for you on the Goerli Testnet and are
                minting some demo tokens.
              </h3>
            )}
            {wallet.address && firstMint && (
              <h3>
                We created a BLS Wallet for you on the Goerli Testnet and have
                minted some demo tokens.
              </h3>
            )}
          </div>
        </Fade>
        <Fade bottom>
          <div className={styles.grid}>
            <div className={styles.a}>
              <strong style={{ opacity: '1' }}>Wallet address:</strong>
            </div>
            <div className={styles.b}>
              {!wallet.address && (
                <img
                  src="loadingSpinner.gif"
                  alt=""
                  style={{
                    height: '1rem',
                    position: 'relative',
                    top: '2px',
                  }}
                />
              )}

              <span style={{ wordBreak: 'break-all' }}>{wallet.address}</span>
            </div>
            <div className={styles.c}>
              <strong style={{ opacity: '1' }}>Token balance: </strong>
            </div>
            <div className={styles.d}>
              {!firstMint ? (
                <img
                  src="loadingSpinner.gif"
                  alt=""
                  style={{
                    height: '1rem',
                    position: 'relative',
                    top: '2px',
                  }}
                />
              ) : (
                <span>{balance}</span>
              )}
            </div>
          </div>
        </Fade>
        <span style={{ height: '18px' }} />
        {firstMint && (
          <div>
            <Fade bottom>
              <h3>
                When users interact with your dApp, you can sponsor their
                transactions, and also bundle their permissions into a single
                wallet request.
              </h3>
            </Fade>
            <span style={{ height: '24px', display: 'block' }} />
            <Fade bottom>
              <>
                {balanceChanging && (
                  <div className={styles.disabledDemoButton}>
                    {' '}
                    <img
                      src="loadingSpinner.gif"
                      alt=""
                      style={{ height: '1rem' }}
                    />
                  </div>
                )}
                {!balanceChanging && (
                  <div
                    className={styles.demoButton}
                    onClick={() => {
                      return balanceChanging
                        ? null
                        : Swal.fire({
                            html: `<div style="text-align: left"><span style="font-size: 12px">Arbitrum testnet</span><h2>BLS Wallet</h2><h3>APPROVE $TOKEN TRANSFER</h3><p><strong>From: </strong>${wallet.address}</p><p><strong>To: </strong>${spenderContract.address}</p><p><strong>Info: </strong><a href="https://blswallet.org/">https://blswallet.org/</a></p><p><strong>Estimated gas fee: </strong>$O <span style="opacity: 1; display: inline; border-radius: 2px; background-color: #bcffbc; border: solid 1px #a5e1a5;font-size: 12px;padding: 2px 4px">dApp sponsored</span></p></div>`,
                            confirmButtonText: 'Confirm',
                            denyButtonText: `Reject`,
                            showCloseButton: true,
                            showCancelButton: true,
                            confirmButtonColor: '#771cf9',
                            position: 'top-end',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              approveAndPullTokens()
                            }
                          })
                    }}
                  >
                    <span style={{ opacity: '1' }}>Approve & pull 1 token</span>
                  </div>
                )}
              </>
            </Fade>
            <div style={{ height: '32px' }} />
            <Fade bottom delay={5000}>
              <p style={{ textAlign: 'center' }}>
                BLS-Wallet is part of{' '}
                <a
                  href="https://appliedzkp.org"
                  rel="noreferrer"
                  target="_blank"
                >
                  Privacy & Scaling Explorations (PSE)
                </a>
                , a multidisciplinary team supported by the Ethereum Foundation.
                PSE explores new use cases for zero knowledge proofs and other
                cryptographic primitives.
              </p>
            </Fade>
          </div>
        )}
        <div style={{ height: '80px' }} />
      </div>
    </>
  )
}
