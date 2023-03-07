import { decodeSingle } from '@metamask/abi-utils';
import { Network } from 'alchemy-sdk';
import { alchemy } from '../alchemy';

const getTokenMetadata = async (address: string) => {
  const { symbol, decimals, name } = await alchemy
    .forNetwork(Network.ETH_GOERLI)
    .core.getTokenMetadata(address);
  const { blockNumber, deployerAddress } = await alchemy
    .forNetwork(Network.ETH_GOERLI)
    .core.findContractDeployer(address);
  return { symbol, decimals, name, blockNumber, deployerAddress };
};

export const decodeERC20Transfers = async (logs) => {
  try {
    return await Promise.all(
      logs
        .filter(
          (log) =>
            (log.decoded?.name === 'Transfer' ||
            log.topics[0] ===
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') && log.topics[3] == undefined
        )
        .map(async (log) => {
          const from = log.topics[1];
          const to = log.topics[2];
          const value = decodeSingle('uint256', log.data).toString(10);
          const { symbol, name, decimals, blockNumber, deployerAddress } =
            await getTokenMetadata(log.address);
          return {
            from,
            to,
            value,
            symbol,
            name,
            decimals,
            blockNumber,
            deployerAddress,
          };
        }),
    );
  } catch {
    return [];
  }
};
