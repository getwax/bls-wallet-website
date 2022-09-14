import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Aggregator, BlsWalletWrapper } from 'bls-wallet-clients'
import Fade from 'react-reveal'
import Swal from 'sweetalert2'

export default function Demo() {
  // You will need to change this to Goerli eventually
  const [network, setNetwork] = useState({
    chainId: '421611',
    name: 'Arbitrum Rinkeby',
    rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-testnet.blswallet.org',
    verificationGateway: '0x697B3E6258B08201d316b31D69805B5F666b62C8',
  })

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

  // For remote development
  const erc20Address = '0x6030c15cD584574A5C694984678D50e5E9Aee1b6'
  // For local development
  // const erc20Address = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

  const erc20Abi = [
    'function mint(address _account, uint256 _amount)',
    'function balanceOf(address) view returns (uint)',
    'function approve(address, uint)',
  ]
  const [erc20, setErc20] = useState(
    new ethers.Contract(erc20Address, erc20Abi, provider),
  )

  const [wallet, setWallet] = useState(false)
  const [balance, setBalance] = useState(0)
  const [balanceChanging, setBalanceChanging] = useState(true)
  const [firstMint, setFirstMint] = useState(false)

  // Connect to the spending contract that Kautuk deployed
  // For remote development on Arbitrum Rinkeby
  const spenderContractAddress = '0xBeC869B56cF9835E26f16f7E29E1e4Ba324634b8'
  // For local development [YET TO DEPLOY LOCAL CONTRACTS]
  // const spenderContractAddress = ''
  const spenderContractAbi = ['function pullTokens(address,uint256)']
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

  const pollBalance = (wallet) => {
    const originalBalance = balance
    const interval = setInterval(async function () {
      console.log('polling...')
      const fetchedBalance = ethers.utils.formatEther(
        await erc20.balanceOf(wallet.address),
      )
      if (fetchedBalance != originalBalance) {
        console.log('balance updated.')
        setBalance(fetchedBalance)
        setBalanceChanging(false)
        setFirstMint(true)
        clearInterval(interval)
      }
    }, 2000)
  }

  const mint = async (generatedWallet) => {
    console.log('minting...')
    setBalanceChanging(true)
    const bundle = generatedWallet.sign({
      nonce: await BlsWalletWrapper.Nonce(
        generatedWallet.PublicKey(),
        network.verificationGateway,
        provider,
      ),
      actions: [
        {
          ethValue: 0,
          contractAddress: erc20.address,
          encodedFunction: erc20.interface.encodeFunctionData('mint', [
            generatedWallet.address,
            ethers.BigNumber.from(10).pow(18),
          ]),
        },
      ],
    })
    await aggregator.add(bundle)
    console.log('mint tx submitted')

    // pollBalance(generatedWallet)
  }

  // On a frontend event, create a transfer and make a fake request for permission
  const initiateSwap = async () => {
    console.log('swapping...')
    setBalanceChanging(true)
    const bundle = wallet.sign({
      nonce: await BlsWalletWrapper.Nonce(
        wallet.PublicKey(),
        network.verificationGateway,
        provider,
      ),
      actions: [
        {
          ethValue: 0,
          contractAddress: erc20.address,
          encodedFunction: erc20.interface.encodeFunctionData('approve', [
            '0xBeC869B56cF9835E26f16f7E29E1e4Ba324634b8',
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
    await aggregator.add(bundle)
    console.log('swap tx submitted')

    // Store transfer success / failure in state to be represented in the frontend
    pollBalance(wallet)
  }

  // Note that the multi-action is the fact that you would normally ask for (1) permission to see and spend account balance and then also (2) permission to actually do the transfer, which we are compressing

  // TOTHINK: then you will need to show how this works without multi-action in some way too. You could just do the same but ask for permission twice. Or maybe the simplest way is to show a video

  // TOTHINK: the idea could also be for the dapp to sponsor the tx and to showcase wallet upgradability via key recovery but that might be blocked at the moment. find out what is blocking it

  return (
    <>
      <Head>
        <title>BLS Wallet</title>
      </Head>
      <Header />
      <div className={styles.main} style={{ position: 'relative' }}>
        <h1
          className={wallet.address ? styles.fadeOut : styles.fadeIn}
          style={{ position: 'absolute', top: '0' }}
        >
          Please wait while we create your BLS wallet on the Arbitrum Testnet.
        </h1>
        <h1
          className={wallet.address ? styles.fadeIn : styles.fadeOut}
          style={{ marginBottom: '3rem' }}
        >
          BLS wallet created on the Arbitrum Testnet.
        </h1>
        <p>
          <strong style={{ opacity: '1' }}>Wallet address: </strong>
          {!wallet.address && (
            <img
              src="loadingSpinner.gif"
              alt=""
              style={{ height: '1rem', position: 'relative', top: '2px' }}
            />
          )}
          {wallet.address}
        </p>
        <h3>
          {firstMint ? "We've minted " : "We're also minting "}
          some BLS test tokens so you can use our multi-action functionality.
        </h3>
        <p>
          <strong style={{ opacity: '1' }}>Balance: </strong>
          {balanceChanging ? (
            <img
              src="loadingSpinner.gif"
              alt=""
              style={{ height: '1rem', position: 'relative', top: '2px' }}
            />
          ) : (
            balance
          )}
        </p>
        {balance > 0 && (
          <button onClick={() => mint(wallet)} disabled={balanceChanging}>
            mint more tokens
          </button>
        )}
        <h3>
          When users interact with your dApp, you can sponsor their transactions
          and bundle their permissions into a single wallet request. Give it a
          go:
        </h3>
        <div
          className={styles.demoButton}
          onClick={() => {
            // balanceChanging
            false
              ? null
              : Swal.fire({
                  html: `<div style="text-align: left"><span style="font-size: 12px">Arbitrum testnet</span><h2>BLS Wallet</h2><h3>$TOKEN for $TOKEN</h3><p><strong>From: </strong>${wallet.address}</p><p><strong>To: </strong>${spenderContract.address}</p><p><strong>Info: </strong><a href="https://blswallet.org/">https://blswallet.org/</a></p><p><strong>Estimated gas fee: </strong>$O <span style="opacity: 1; display: inline; border-radius: 2px; background-color: #bcffbc; border: solid 1px #a5e1a5;font-size: 12px;padding: 2px 4px">dApp sponsored</span></p></div>`,
                  confirmButtonText: 'Confirm',
                  denyButtonText: `Reject`,
                  showCloseButton: true,
                  showCancelButton: true,
                  confirmButtonColor: '#771cf9',
                  position: 'top-end',
                }).then((result) => {
                  if (result.isConfirmed) {
                    initiateSwap
                  }
                })
          }}
        >
          Initiate swap
        </div>
      </div>
    </>
  )
}

// we need to show
// (1) multi action (use Kautuk as inspiration, there may be a defi swap)
// but the minting has to take place behind the scenes
// approving token transfer on the ERC20 contract, granting permission to the swap contract address
// calling the swap function on the swap contract
// and draw attention to the security benefit of not giving infinite permission to transfer unlimited funds
// (2) dapp sponsored tx (Kautuk might know more about this)
// (3) wallet upgradability via key recovery (Blake currently working on, will have something to do with persisting key in local storage like Blake did)

// Steps to improve
// 1. Clean up frontend
// 2. Include demo of 'without multi-action'
// 3. Make it so that the wallet mints automatically on page load
// 4. Make it so that the balance is polled automatically rather than on a push and a loader is used in the meantime
// 5. Get aggregator logs so that you can verify if the transfer / minting is working and why / why not
// 6. Testing library
// 7. James may want deeper features from Blake's instant wallet including state storage
// 8. Blogpost
// 9. Implement prompts for permission to showcase multi-action

// const approveTx = await erc20
//   .connect(provider.getSigner(wallet.address))
//   .populateTransaction.approve(
//     '0xBeC869B56cF9835E26f16f7E29E1e4Ba324634b8',
//     ethers.utils.parseEther('10'),
//   )
// const pullTx = await spenderContract
//   .connect(provider.getSigner(wallet.address))
//   .populateTransaction.pullTokens(
//     erc20Address,
//     ethers.utils.parseEther('10'),
//   )
