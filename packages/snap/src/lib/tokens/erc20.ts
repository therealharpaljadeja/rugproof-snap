import { decodeSingle } from '@metamask/abi-utils';
import { Network } from 'alchemy-sdk';
import { alchemy } from '../alchemy';

const getTokenMetadata = async (address: string) => {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=goerli&addresses%5B0%5D=${address}`,
    {
      headers: {
        'X-API-Key':
          'jbMr8QqBgNvipNjN8Qn5Ovty6gXcSp01kFFyTNThmER42Cuz8SxBTa0rafDQLOUf',
      },
    },
  );

  const result = await response.json();
  const { name, symbol, decimals } = result[0];
  console.log(name, symbol, decimals);

  return { symbol, decimals, name };
};

export const decodeERC20Transfers = async (logs) => {
  try {
    return await Promise.all(
      logs
        .filter(
          (log) =>
            (log.decoded?.name === 'Transfer' ||
              log.topics[0] ===
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') &&
            log.topics[3] == undefined,
        )
        .map(async (log) => {
          const from = log.topics[1];
          const to = log.topics[2];
          const value = decodeSingle('uint256', log.data).toString(10);
          const { symbol, name, decimals } = await getTokenMetadata(
            log.address,
          );
          return {
            from,
            to,
            value,
            symbol,
            name,
            decimals,
          };
        }),
    );
  } catch {
    return [];
  }
};
