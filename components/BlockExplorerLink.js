import { useMemo } from 'react';

function BlockExplorerLink({ txHash }) {
  const shortHash = useMemo(
    () => `${txHash.slice(0, 6)}...${txHash.slice(-4)}`,
    [txHash],
  );

  return (
    <div>
      <p>Transaction successful 🎉</p>
      <p>
        <a
          href={`https://goerli-rollup-explorer.arbitrum.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {shortHash}
        </a>
      </p>
    </div>
  );
}

export default BlockExplorerLink;
