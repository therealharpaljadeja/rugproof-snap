import { decodeERC20Transfers } from './erc20';
import { decodeERC721Transfers } from './erc721';

export const decodeTokenTransfers = async (logs: any) => {
  const erc20Transfers = await decodeERC20Transfers(logs);
  const erc721Transfers = await decodeERC721Transfers(logs);

  return { erc20Transfers, erc721Transfers };
};
