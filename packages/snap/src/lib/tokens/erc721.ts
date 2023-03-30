import { decodeSingle } from '@metamask/abi-utils';

const getContractMetadata = async (address: string) => {
  let response = await fetch(
    `https://deep-index.moralis.io/api/v2/nft/${address}/metadata?chain=goerli`,
    {
      headers: {
        'X-API-Key':
          'jbMr8QqBgNvipNjN8Qn5Ovty6gXcSp01kFFyTNThmER42Cuz8SxBTa0rafDQLOUf',
      },
    },
  );

  let { name, symbol, contract_type } = await response.json();
  return { name, symbol, contract_type };
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
          let { name, symbol, contract_type } = await getContractMetadata(
            log.address,
          );
          return {
            from,
            to,
            tokenId,
            symbol,
            name,
            contract_type,
          };
        }),
    );
  } catch {
    return [];
  }
};
