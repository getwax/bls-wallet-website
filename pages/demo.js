import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Aggregator, BlsWalletWrapper } from 'bls-wallet-clients'

export default function Demo() {
  // You will need to change this to Goerli eventually
  const [network, setNetwork] = useState({
    chainId: '421611',
    name: 'Arbitrum Rinkeby',
    rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-testnet.blswallet.org',
    verificationGateway: '0x697B3E6258B08201d316b31D69805B5F666b62C8',
  })
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
  const erc20Address = '0x6030c15cD584574A5C694984678D50e5E9Aee1b6'
  const erc20Abi = [
    'function mint(address _account, uint256 _amount)',
    'function balanceOf(address) view returns (uint)',
    'function transfer(address to, uint amount)',
  ]
  const [erc20, setErc20] = useState(
    new ethers.Contract(erc20Address, erc20Abi, provider),
  )

  const [wallet, setWallet] = useState({})
  const [balance, setBalance] = useState(0)

  // We want to generate the wallet only once so we do so within a useEffect() hook, without any dependencies so it doesn't re-run
  useEffect(() => {
    // Generate a temporary BLS wallet using the private key, provider and verification gateway
    const generateWallet = async () => {
      const generatedWallet = await BlsWalletWrapper.connect(
        privateKey,
        network.verificationGateway,
        provider,
      )
      setWallet(generatedWallet)
    }
    generateWallet()

    // Call the token contract to mint some tokens
    const mint = async () => {
      const bundle = wallet.sign({
        nonce: await BlsWalletWrapper.Nonce(
          await wallet.PublicKey(),
          network.verificationGateway,
          provider,
        ),
        actions: [
          {
            ethValue: 0,
            contractAddress: erc20.address,
            encodedFunction: erc20.interface.encodeFunctionData('mint', [
              wallet.address,
              ethers.BigNumber.from(1).pow(18),
            ]),
          },
        ],
      })
      // await aggregator.add(bundle)

      // Store minting success/failure in state to be represented in the frontend
      // setBalance(
      //   ethers.utils.formatEther(await erc20.balanceOf(wallet.address)),
      // )
    }
    mint()
  }, [])

  // On a frontend event, create a transfer and make a fake request for permission
  const initiateSwap = async () => {
    // Connect to the spending contract that Kautuk deployed
    const spendingContractAddress = ''
    const spendingContractAbi = []
    // const spendingContract = new ethers.Contract(spendingContractAddress, spendingContractAbi, provider)
    // const nonce = wallet.Nonce()
    // const bundle = wallet.sign({ nonce: nonce, actions: [{}] })
    // {to add: ask for permission with some kind of modal}
    // aggregator.add(bundle)
    // Store transfer success / failure in state to be represented in the frontend
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
      <div className={styles.main}>
        <p>
          Hello, we have generated you a temporary wallet to showcase BLS
          functionality.{' '}
        </p>
        <p>
          Your wallet address is{' '}
          {wallet.address || (
            <img src="loadingSpinner.gif" alt="" style={{ height: '1rem' }} />
          )}
          {wallet.address} and you currently hold {balance} tokens.
        </p>
        <p>
          In a normal swap app like UniSwap you would need to grant permission
          from metamask (or whatever wallet) multiple times in order to make a
          swap
        </p>
        <p>Here you can do it in just one click</p>
        <button onClick={initiateSwap}>initiate swap</button>
        <p>Current state:</p>
        <p>[loading spinner] approving transfer</p>
        <p>[loading spinner] transferring</p>
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
