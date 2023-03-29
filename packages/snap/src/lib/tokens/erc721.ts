import { decodeSingle } from '@metamask/abi-utils';
import dotenv from 'dotenv';
dotenv.config();

const getContractMetadata = async (address: string) => {
  let response = await fetch(
    `https://api.nftport.xyz/v0/nfts/${address}?chain=goerli&page_number=1&page_size=50&include=metadata&refresh_metadata=false`,
    {
      headers: {
        Authorization: '327421dc-7d0d-4533-9476-041b36c95f94',
      },
    },
  );
  let { contract } = await response.json();
  let { name, symbol, type } = contract;
  return { name, symbol, type };
};

// const decodeSingleNFT = async (
//   address: string,
//   tokenId: string,
//   tokenType: NftTokenType,
// ) => {
//   try {
//     console.log(address, tokenId, tokenType);
//     const response = await fetch(
//       `https://api.nftport.xyz/v0/nfts/${address}/${tokenId}?chain=goerli`,
//       {
//         headers: {
//           Authorization: '327421dc-7d0d-4533-9476-041b36c95f94',
//         },
//       },
//     );
//     let  { titel,}
//     const { title, description, spamInfo } = await alchemy
//       .forNetwork(Network.ETH_GOERLI)
//       .nft.getNftMetadata(address, tokenId);
//     console.log(title, description, spamInfo);
//     return { title, description, spamInfo };
//   } catch (e) {
//     throw new Error(e);
//   }
// };

export const decodeERC721Transfers = async (logs) => {
  try {
    return await Promise.all(
      logs
        .filter(
          (log) =>
            log.topics[0] ===
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        )
        .map(async (log) => {
          const from = log.topics[1];
          const to = log.topics[2];
          const tokenId = decodeSingle('uint256', log.topics[3]).toString(10);
          let { name, symbol, type } = await getContractMetadata(log.address);
          return {
            from,
            to,
            tokenId,
            symbol,
            name,
            type,
          };
        }),
    );
  } catch {
    return [];
  }
};
