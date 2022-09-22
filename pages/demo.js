import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Aggregator, BlsWalletWrapper } from 'bls-wallet-clients'
import Fade from 'react-reveal'
import Swal from 'sweetalert2'

export default function Demo() {
  // For Goerli development
  const [network, setNetwork] = useState({
    chainID: '0x66EED',
    name: 'Arbitrum Goerli',
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-goerli.blswallet.org',
    verificationGateway: '0xAf96d6e0817Ff8658f0E2a39b641920fA7fF0957',
  })

  // For Arbitrum Rinkeby development
  // const [network, setNetwork] = useState({
  //   chainId: '421611',
  //   name: 'Arbitrum Rinkeby',
  //   rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
  //   aggregatorUrl: 'https://arbitrum-testnet.blswallet.org',
  //   verificationGateway: '0x697B3E6258B08201d316b31D69805B5F666b62C8',
  // })

  // For local development
  // const [network, setNetwork] = useState({
  //   chainId: '31337',
  //   name: 'Local hardhat node',
  //   rpcUrl: 'http://localhost:8545',
  //   aggregatorUrl: 'http://localhost:4000/',
  //   verificationGateway: '0x81Ea02723aA4097C39A79545f851490aEe4B09C8',
  // })

  // Connect to the BLS Aggregator for your network
  const [aggregator, setAggregator] = useState(
    new Aggregator(network.aggregatorUrl),
  )
  // Initiate the provider
  const [provider, setProvider] = useState(
    new ethers.providers.JsonRpcProvider(network.rpcUrl),
  )
  // Create a private key by fetching it from local storage or generating and persisting a new private key
  const [privateKey, setPrivateKey] = useState(
    ethers.Wallet.createRandom().privateKey,
  )

  // Connect to the token contract that Kautuk deployed and store it in state

  // For remote goerli development
  const erc20Address = '0x56377a667C6370154d43aFc937998C750f0ca9bd'
  // For remote rinkeby development
  // const erc20Address = '0x6030c15cD584574A5C694984678D50e5E9Aee1b6'
  // For local development
  // const erc20Address = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

  const erc20Abi = [
    'function mint(address _account, uint256 _amount)',
    'function balanceOf(address) view returns (uint)',
    'function approve(address _account, uint256 _amount)',
  ]
  const [erc20, setErc20] = useState(
    new ethers.Contract(erc20Address, erc20Abi, provider),
  )

  const [wallet, setWallet] = useState(false)
  const [balance, setBalance] = useState(0)
  const [balanceChanging, setBalanceChanging] = useState(true)
  const [firstMint, setFirstMint] = useState(false)

  // Connect to the spending contract that Kautuk deployed

  // For remote goerli development
  const spenderContractAddress = '0x95B02CcF67ceacaBbc33927a5d7607Df590c81F6'
  // For remote development on Arbitrum Rinkeby
  // const spenderContractAddress = '0xBeC869B56cF9835E26f16f7E29E1e4Ba324634b8'
  // For local development [YET TO DEPLOY LOCAL CONTRACTS]
  // const spenderContractAddress = ''
  const spenderContractAbi = [
    'function pullTokens(address _account,uint256 _amount)',
  ]
  const [spenderContract, setSpenderContract] = useState(
    new ethers.Contract(spenderContractAddress, spenderContractAbi, provider),
  )

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
      mint(generatedWallet)
    }
    intialiseWallet()
    // Call the token contract to mint some tokens
  }, [])

  const pollBalance = async (wallet) => {
    const originalBalance = balance
    const interval = setInterval(async function () {
      console.log('polling...')
      console.log(`original balance is ${balance}`)
      const fetchedBalance = ethers.utils.formatEther(
        await erc20.balanceOf(wallet.address),
      )
      console.log(`polled balance is ${fetchedBalance}`)
      if (fetchedBalance != originalBalance) {
        console.log('balance updated.')
        setBalance(fetchedBalance)
        setBalanceChanging(false)
        setFirstMint(true)
        clearInterval(interval)
      }
    }, 2000)
    setTimeout(() => {
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
    }, 1000000)
  }

  const mint = async (generatedWallet) => {
    console.log('minting...')
    setBalanceChanging(true)
    const nonce = await BlsWalletWrapper.Nonce(
      generatedWallet.PublicKey(),
      network.verificationGateway,
      provider,
    )
    const bundle = generatedWallet.sign({
      nonce: nonce,
      actions: [
        {
          ethValue: 0,
          contractAddress: erc20.address,
          encodedFunction: erc20.interface.encodeFunctionData('mint', [
            generatedWallet.address,
            ethers.BigNumber.from(10).pow(20),
          ]),
        },
      ],
    })
    console.log(await aggregator.add(bundle))
    console.log('mint tx submitted')
    pollBalance(generatedWallet)
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
    console.log(await aggregator.add(bundle))
    console.log('approval / pull txs submitted')
    // Store transfer success / failure in state to be represented in the frontend
    pollBalance(wallet)
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
                      balanceChanging
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
