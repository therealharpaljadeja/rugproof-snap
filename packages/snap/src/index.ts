import { OnTransactionHandler } from '@metamask/snaps-types';
import { divider, panel, text } from '@metamask/snaps-ui';
import { Network } from 'alchemy-sdk';
import { alchemy } from './lib/alchemy';
import {
  interpretResult,
  isUserInteractingWithContractFirstTime,
  toInsights,
} from './lib/interpretation';
import { formatUnits } from '@ethersproject/units';

const simulate = async (transaction): Promise<any> => {
  let insights = {};
  try {
    let receipt = await alchemy
      .forNetwork(Network.ETH_GOERLI)
      .transact.simulateExecution(transaction);

    let interpretationResult = await interpretResult(receipt);
    let isFirstInteraction = await isUserInteractingWithContractFirstTime(
      transaction,
    );
    let {
      isDeployerTornadoUser,
      contractAge,
      isContractVerified,
      countNumberOfTimesFunctionIsCalled,
    } = await toInsights(transaction);

    insights = {
      interpretationResult,
      isFirstInteraction,
      isDeployerTornadoUser,
      contractAge,
      isContractVerified,
      countNumberOfTimesFunctionIsCalled,
    };

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
  console.time('Snap');
  const insights = await simulate(transaction);
  let erc20s, erc721s;
  if (insights.interpretationResult) {
    const {
      interpretationResult,
      isFirstInteraction,
      isDeployerTornadoUser,
      contractAge,
      isContractVerified,
      countNumberOfTimesFunctionIsCalled,
    } = insights;
    if (interpretationResult.tokenTransfers) {
      if (interpretationResult.tokenTransfers.erc20Transfers) {
        erc20s = interpretationResult.tokenTransfers.erc20Transfers.map(
          ({ value, decimals, symbol, from: tokenFrom, to }) => {
            return panel([
              text(`Transferring ${formatUnits(value, decimals)} ${symbol}`),
              text(`**From:** ${tokenFrom}`),
              text(`**To:** ${to}`),
              tokenFrom == '0x0'
                ? text(
                    `Minting ${formatUnits(value, decimals)} ${symbol} tokens.`,
                  )
                : text(''),
            ]);
          },
        );
      }
      if (interpretationResult.tokenTransfers.erc721Transfers) {
        erc721s = interpretationResult.tokenTransfers.erc721Transfers.map(
          ({ from: tokenFrom, to, tokenId, name }) =>
            panel([
              text(`Transferring ${name} (${tokenId})`),
              text(`**From:** ${tokenFrom}`),
              text(`**To:** ${to}`),
              tokenFrom == '0x0'
                ? text(`Minting token id ${tokenId} of ${name} Collection.`)
                : text(''),
            ]),
        );
      }
    }
    console.timeEnd('Snap');
    return {
      content: panel([
        ...(isFirstInteraction
          ? [
              text(
                '🟡 You are interacting with this contract for the first time! 🟡',
              ),
              divider(),
            ]
          : []),
        ...(isDeployerTornadoUser
          ? [
              text('🔴 Contract Deployer has used Tornado Cash before 🔴'),
              divider(),
            ]
          : []),
        ...(isContractVerified
          ? [text('🟢 Contract is Verified on Etherscan! 🟢'), divider()]
          : [
              text(
                '🟡 Contract is not verified on Etherscan, proceed with caution 🟡',
              ),
              divider(),
            ]),
        ...(erc20s.length > 0
          ? [text('**ERC20 transfers**'), ...erc20s, divider()]
          : []),
        ...(erc721s.length > 0
          ? [text('**ERC721 transfers**'), ...erc721s, divider()]
          : []),
        text(`Contract is ${contractAge} days old`),
        divider(),
        text(
          `The function being called has been called ${countNumberOfTimesFunctionIsCalled} times in the past!`,
        ),
      ]),
    };
  } else {
    return {
      content: panel([text('Execution failed')]),
    };
  }
};
