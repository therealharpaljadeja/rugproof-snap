import { hexToBigInt, hexToNumber } from '@metamask/utils';
import { Network, AssetTransfersCategory } from 'alchemy-sdk';
import { alchemy } from './alchemy';
import { decodeTokenTransfers } from './tokens';

export const interpretResult = async (receipt: any) => {
  const { logs } = receipt;
  const tokenTransfers = await decodeTokenTransfers(logs);
  return { logs, tokenTransfers };
};

export const isUserInteractingWithContractFirstTime = async (
  transaction: any,
) => {
  let result = await alchemy
    .forNetwork(Network.ETH_GOERLI)
    .core.getAssetTransfers({
      category: [
        // AssetTransfersCategory.EXTERNAL,
        // AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
      ],
    });
  let filtered = result.transfers.filter(
    (transfer) => transfer.to === transaction.to,
  );
  return !filtered.length;
};
