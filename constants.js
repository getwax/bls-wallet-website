export const NETWORKS = {
  arbitrumGoerli: {
    chainID: '0x66EED',
    name: 'Arbitrum Goerli',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC ?? 'https://goerli-rollup.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-goerli-2.blswallet.org/',
    verificationGateway: '0xE25229F29BAD62B1198F05F32169B70a9edc84b8',
  },
  // For local dev make sure these values match your environment
  local: {
    chainId: '31337',
    name: 'Local hardhat node',
    rpcUrl: 'http://localhost:8545',
    aggregatorUrl: 'http://localhost:3000',
    verificationGateway: '0xE25229F29BAD62B1198F05F32169B70a9edc84b8',
  },
};

export const ERC20_ADDRESS = {
  arbitrumGoerli: '0x30e69AfbE8c2E8ECe8d6920512452C8d13F8962A',
  arbitrumRinkeby: '0x6030c15cD584574A5C694984678D50e5E9Aee1b6',
  // For local dev make sure this value matches your environment
  local: '',
};

export const SPENDER_CONTRACT_ADDRESS = {
  arbitrumGoerli: '0x95B02CcF67ceacaBbc33927a5d7607Df590c81F6',
  arbitrumRinkeby: '0xBeC869B56cF9835E26f16f7E29E1e4Ba324634b8',
  // For local dev make sure this value matches your environment
  local: '',
};
