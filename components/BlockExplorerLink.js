function BlockExplorerLink({ blockNumber }) {
  return (
    <div>
      <p>Transaction successful 🎉</p>
      <p>
        Block explorer:{' '}
        <a
          href={`https://goerli-rollup-explorer.arbitrum.io/block/${blockNumber}/transactions`}
          target="_blank"
          rel="noreferrer noopener"
        >
          click here!
        </a>
      </p>
    </div>
  )
}

export default BlockExplorerLink;