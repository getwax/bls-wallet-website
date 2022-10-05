export const NETWORKS = {
  arbitrumGoerli: {
    chainID: '0x66EED',
    name: 'Arbitrum Goerli',
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-goerli.blswallet.org',
    verificationGateway: '0xAf96d6e0817Ff8658f0E2a39b641920fA7fF0957',
  },
  arbitrumRinkeby: {
    chainId: '421611',
    name: 'Arbitrum Rinkeby',
    rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-testnet.blswallet.org',
    verificationGateway: '0x697B3E6258B08201d316b31D69805B5F666b62C8',
  },
  // For local dev make sure these values match your environment
  local: {
    chainId: '31337',
    name: 'Local hardhat node',
    rpcUrl: 'http://localhost:8545',
    aggregatorUrl: 'http://localhost:4000/',
    verificationGateway: '0x81Ea02723aA4097C39A79545f851490aEe4B09C8',
  },
}

export const ERC20_ADDRESS = {
  arbitrumGoerli: '0x56377a667C6370154d43aFc937998C750f0ca9bd',
  arbitrumRinkeby: '0x6030c15cD584574A5C694984678D50e5E9Aee1b6',
  // For local dev make sure this value matches your environment
  local: '',
}

export const SPENDER_CONTRACT_ADDRESS = {
  arbitrumGoerli: '0x95B02CcF67ceacaBbc33927a5d7607Df590c81F6',
  arbitrumRinkeby: '0xBeC869B56cF9835E26f16f7E29E1e4Ba324634b8',
  // For local dev make sure this value matches your environment
  local: '',
}