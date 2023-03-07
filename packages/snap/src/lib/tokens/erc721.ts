import { decodeSingle } from '@metamask/abi-utils';
import { Network, NftTokenType } from 'alchemy-sdk';
import { alchemy } from '../alchemy';

const getContractMetadata = async (address: string) => {
  let { name, symbol, tokenType } = await alchemy
    .forNetwork(Network.ETH_GOERLI)
    .nft.getContractMetadata(address);
  return { name, symbol, tokenType };
};

const decodeSingleNFT = async (
  address: string,
  tokenId: string,
  tokenType: NftTokenType,
) => {
  try {
    const { title, description, spamInfo } = await alchemy
      .forNetwork(Network.ETH_GOERLI)
      .nft.getNftMetadata(address, tokenId, tokenType);
    console.log(title, description, spamInfo);
    return { title, description, spamInfo };
  } catch (e) {
    throw new Error(e);
  }
};

export const decodeERC721Transfers = async (logs) => {
  try {
    return await Promise.all(
      logs
        .filter(
          (log) =>
            (log.decoded?.name === 'Transfer' ||
              log.topics[0] ===
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') &&
            log.topics[3] != undefined,
        )
        .map(async (log) => {
          const from = log.topics[1];
          const to = log.topics[2];
          const tokenId = decodeSingle('uint256', log.topics[3]).toString(10);
          let { name, symbol, tokenType } = await getContractMetadata(
            log.address,
          );
          console.log(symbol, name, tokenType);
          const { title, description, spamInfo } = await decodeSingleNFT(
            log.address,
            tokenId,
            tokenType,
          );
          return {
            from,
            to,
            tokenId,
            symbol,
            name,
            tokenType,
            title,
            description,
            spamInfo,
          };
        }),
    );
  } catch {
    return [];
  }
};
