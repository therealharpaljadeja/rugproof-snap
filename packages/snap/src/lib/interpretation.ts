import { decodeTokenTransfers } from './tokens';

export const interpretResult = async (receipt: any) => {
  const { logs } = receipt;
  const tokenTransfers = await decodeTokenTransfers(logs);
  return { logs, tokenTransfers };
};

async function getTxList(address: string) {
  let response = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  let { result } = await response.json();
  return result;
}

export const isUserInteractingWithContractFirstTime = async (
  transaction: any,
) => {
  let response = await fetch(
    `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${transaction.from}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  let { result } = await response.json();
  let filtered = result.filter((tx) => tx.to === transaction.to);
  return !filtered.length;
};

const hasContractDeployerInteractedWithTornado = async (address: string) => {
  let response = await fetch(
    `https://api-goerli.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  let { result } = await response.json();
  let deployer = result[0].contractCreator;
  let deployerTxs = await getTxList(deployer);
  let txs = deployerTxs.filter(
    (tx) => tx.to === '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
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

export async function toInsights(transaction: any) {
  let response = await fetch(
    `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${transaction.to}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  let { result } = await response.json();
  let isDeployerTornadoUser = await hasContractDeployerInteractedWithTornado(
    transaction.to,
  );

  const contractAge = Math.round(
    Math.round(Date.now() / 1000 - Number(result[0].timeStamp)) /
      (24 * 60 * 60),
  );

  let contractABI = await getContractABI(transaction.to);

  let countNumberOfTimesFunctionIsCalled = result.filter(
    (tx) => tx.methodId === transaction.data.substring(0, 10),
  );

  return {
    isDeployerTornadoUser,
    contractAge,
    isContractVerified:
      contractABI === 'Contract source code not verified' ? false : true,
    countNumberOfTimesFunctionIsCalled:
      countNumberOfTimesFunctionIsCalled.length,
  };
}
