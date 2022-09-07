import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import { ethers } from 'ethers'
import { Aggregator, BlsWalletWrapper } from 'bls-wallet-clients'

export default function Demo() {
  const network = {
    arbitrumRinkeby: {
      chainId: '421611',
      name: 'Arbitrum Rinkeby',
      rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
      aggregatorUrl: 'https://arbitrum-testnet.blswallet.org',
      verificationGateway: '0x697B3E6258B08201d316b31D69805B5F666b62C8',
    },
  }
  const provider = new ethers.providers.JsonRpcProvider(
    network.arbitrumRinkeby.rpcUrl,
  )
  const privateKey = ethers.Wallet.createRandom().privateKey

  const aggregateBundle = async () => {
    const wallet = await BlsWalletWrapper.connect(
      privateKey,
      network.arbitrumRinkeby.verificationGateway,
      provider,
    )
    const nonce = await wallet.Nonce()
    const bundle = wallet.sign({
      nonce: nonce,
      actions: [
        {
          // mint an NFT?
          // but to do this you need to interact with an on-chain contract. which contract? one that you have deployed? are there any 'helpers' you can use?
          // cba to deploy a contract to rinkeby. does it even stay there? cos it's just rinkeby
          // transfer the NFT
          // modify the NFT
          // ethValue: 0,
          // contractAddress: someToken.address, // An ethers.Contract
          // encodedFunction: someToken.interface.encodeFunctionData('transfer', [
          //   '0x...some address...',
          //   ethers.BigNumber.from(1).pow(18),
          // ]),
        },
        // Additional actions can go here. When using multiple actions, they'll
        // either all succeed or all fail.
      ],
    })
    const aggregator = new Aggregator(network.arbitrumRinkeby.aggregatorUrl)
    return await aggregator.add(bundle)
  }
  aggregateBundle()

  // Also need to make single-action txs
  // QUESTION: how will this be zero-cost? where is the gas fee?

  return (
    <>
      <Head>
        <title>BLS Wallet</title>
      </Head>
      <Header />
      <div className={styles.main}></div>
    </>
  )
}
