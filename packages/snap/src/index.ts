import {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snaps-types';
import {
  copyable,
  divider,
  heading,
  panel,
  spinner,
  text,
} from '@metamask/snaps-ui';
import { Network } from 'alchemy-sdk';
import { alchemy } from './lib/alchemy';
import {
  interpretResult,
  isUserInteractingWithContractFirstTime,
} from './lib/interpretation';
import { formatUnits } from '@ethersproject/units';

const simulate = async (transaction): Promise<any> => {
  let insights = {};
  try {
    let receipt = await alchemy
      .forNetwork(Network.ETH_GOERLI)
      .transact.simulateExecution(transaction);
    console.log(receipt);

    let interpretationResult = await interpretResult(receipt);
    // let isFirstInteraction = await isUserInteractingWithContractFirstTime(
    //   transaction,
    // );

    insights = { interpretationResult };

    return insights;
  } catch (e) {
    return { insights: { error: e } };
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  let start = Date.now();
  const insights = await simulate(transaction);
  if (insights.interpretationResult) {
    const { interpretationResult } = insights;
    const erc20s = interpretationResult.tokenTransfers.erc20Transfers.map(
      ({ value, decimals, symbol, from: tokenFrom, to }) => {
        return panel([
          text(`Transferring ${formatUnits(value, decimals)} ${symbol}`),
          text(`**From:** ${tokenFrom}`),
          text(`**To:** ${to}`),
          tokenFrom == '0x0' &&
            text(`Minting ${formatUnits(value, decimals)} ${symbol} tokens.`),
        ]);
      },
    );
    const erc721s = interpretationResult.tokenTransfers.erc721Transfers.map(
      ({ from: tokenFrom, to, tokenId, name }) =>
        panel([
          text(`Transferring ${name} (${tokenId})`),
          text(`**From:** ${tokenFrom}`),
          text(`**To:** ${to}`),
          tokenFrom == '0x0' &&
            text(`Minting token id ${tokenId} of ${name} Collection.`),
        ]),
    );
    console.log((Date.now() - start) / 1000);
    return {
      content: panel([
        // isFirstInteraction && text('🟡 You are interacting with this contract for the first time! 🟡'),
        // divider(),
        ...(erc20s.length > 0
          ? [text('**ERC20 transfers**'), ...erc20s, divider()]
          : []),
        ...(erc721s.length > 0
          ? [text('**ERC721 transfers**'), ...erc721s, divider()]
          : []),
      ]),
    };
  } else {
    return {
      content: panel([text('Execution failed')]),
    };
  }
};
