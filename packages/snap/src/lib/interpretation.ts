import { decodeTokenTransfers } from './tokens';

export const interpretResult = async (receipt: any) => {
  const { logs } = receipt;
  const tokenTransfers = await decodeTokenTransfers(logs);
  return { logs, tokenTransfers };
};

async function getTxList(address: string) {
  let response = await fetch(
    `https://deep-index.moralis.io/api/v2/${address}?chain=goerli`,
    {
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY as string,
      },
    },
  );
  let { result } = await response.json();
  return result;
}

export const isUserInteractingWithContractFirstTime = async (
  transaction: any,
) => {
  let result = await getTxList(transaction.from);
  let filtered = result.filter((tx) => tx.to === transaction.to);
  return !filtered.length;
};

const hasContractDeployerInteractedWithTornado = async (
  deploymentTransaction: any,
) => {
  let deployer = deploymentTransaction.contractCreator;

  let deployerTxs = await getTxList(deployer);
  let txs = deployerTxs.filter(
    (tx) =>
      tx.receipt_contract_address ===
      '0xedcc67ce2776011be7a8525505223330a982fd68',
  );

  return txs.length;
};

const getContractABI = async (address: string) => {
  let response = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  let { result } = await response.json();
  return result;
};

async function calculateContractAge(txHash: string) {
  let response = await fetch(
    `https://deep-index.moralis.io/api/v2/transaction/${txHash}?chain=goerli`,
    {
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY as string,
      },
    },
  );

  let { block_timestamp } = await response.json();

  let contractAge = Math.round(
    Math.round(Date.now() - new Date(block_timestamp).valueOf()) /
      (24 * 60 * 60 * 1000),
  );

  return contractAge;
}

export async function toInsights(transaction: any) {
  // Get contract creation transaction hash.
  let response = await fetch(
    `https://api-goerli.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${transaction.to}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  let { result } = await response.json();

  let isDeployerTornadoUser = await hasContractDeployerInteractedWithTornado(
    result[0],
  );

  // Get transaction details using deployment transaction hash
  let contractAge = await calculateContractAge(result[0].txHash);

  // Get Contract ABI from etherscan
  let contractABI = await getContractABI(transaction.to);

  let countNumberOfTimesFunctionIsCalled = result.filter(
    (tx) => tx.methodId === transaction.data.substring(0, 10),
  );

  return {
    isDeployerTornadoUser,
    contractAge: contractAge ?? 'unknown',
    isContractVerified:
      contractABI === 'Contract source code not verified' ? false : true,
    countNumberOfTimesFunctionIsCalled:
      countNumberOfTimesFunctionIsCalled.length,
  };
}
