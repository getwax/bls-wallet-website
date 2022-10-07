import React, { useEffect, useRef } from 'react';
import { Aggregator } from 'bls-wallet-clients';

import { NETWORKS } from "../constants";

// This function will accept a transaction hash and will
// fire a toast when the transaction is completed.
function TxStatus({ setTxFinished, txHash, toastMethod }) {

  useInterval(async () => {
    const receipt = await getTransactionReceipt(txHash);

    if (receipt === undefined) {
      return;
    }

    toastMethod(receipt.blockNumber);
    setTxFinished(txHash);
  }, 4000);

  return (
    <div />
  );
}

export default TxStatus;


function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
    return undefined;
  }, [callback, delay]);
}

async function getTransactionReceipt(hash) {
  const aggregator = new Aggregator(NETWORKS.arbitrumGoerli.aggregatorUrl);
  const bundleReceipt= await aggregator.lookupReceipt(hash);

  return (
    bundleReceipt && {
      transactionHash: hash,
      transactionIndex: bundleReceipt.transactionIndex,
      blockHash: bundleReceipt.blockHash,
      blockNumber: bundleReceipt.blockNumber,
      logs: [],
      cumulativeGasUsed: '0x0',
      gasUsed: '0x0',
      status: '0x1',
      effectiveGasPrice: '0x0',
    }
  );
}