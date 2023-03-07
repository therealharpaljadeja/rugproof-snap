import { useContext } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap, shouldDisplayReconnectButton } from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
import SampleNFTAbi from '../abi/SampleNFT';
import SampleTokenAbi from '../abi/SampleToken';
import { ethers } from 'ethers';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 85rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const domain = {
  name: 'SampleToken',
  version: '1',
  chainId: 5,
  verifyingContract:
    '0x9b66d55D0a737E0f9d08F2d56436D9A6D512e4bf' as `0x${string}`,
};

const types = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleMintToken = async () => {
    try {
      let networkVersion = await window.ethereum.request({
        method: 'net_version',
      });

      if (networkVersion !== '5') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      }

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let token = new ethers.Contract(
        '0x9b66d55D0a737E0f9d08F2d56436D9A6D512e4bf',
        SampleTokenAbi,
        await provider.getSigner(),
      );

      await token.mint();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleMintNFT = async () => {
    try {
      let networkVersion = await window.ethereum.request({
        method: 'net_version',
      });

      if (networkVersion !== '5') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      }

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let token = new ethers.Contract(
        '0x15C2B9e9fc4f4960cADBfF74c4B455464a146FAE',
        SampleNFTAbi,
        await provider.getSigner(),
      );

      await token.mint();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleClaimTokenAirdrop = async () => {
    try {
      let networkVersion = await window.ethereum.request({
        method: 'net_version',
      });

      if (networkVersion !== '5') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      }

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = await provider.getSigner();

      await signer._signTypedData(domain, types, {
        owner: await signer.getAddress(),
        spender: '0x22e4aFF96b5200F2789033d85fCa9F58f163E9Ea',
        nonce: 0,
        value: ethers.utils.parseEther('10'),
        deadline: Math.round(Date.now() / 1000) + 100_000,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleClaimNFTAirdrop = async () => {
    try {
      let networkVersion = await window.ethereum.request({
        method: 'net_version',
      });

      if (networkVersion !== '5') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      }

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let token = new ethers.Contract(
        '0x15C2B9e9fc4f4960cADBfF74c4B455464a146FAE',
        SampleNFTAbi,
        await provider.getSigner(),
      );

      await token.setApprovalForAll(
        '0x22e4aff96b5200f2789033d85fca9f58f163e9ea',
        true,
      );
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>rugproof-snap</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Mint SampleToken',
            description: 'Mint Sample Token to see token transfer insights',
            button: (
              <SendHelloButton
                onClick={handleMintToken}
                disabled={!state.installedSnap}
                message="Mint Token"
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Mint SampleNFT',
            description: 'Mint Sample NFT to see token transfer insights',
            button: (
              <SendHelloButton
                onClick={handleMintNFT}
                disabled={!state.installedSnap}
                message="Mint NFT"
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Claim Airdrop',
            description:
              'A request to approve tokens using Permit disgused as Claim Airdrop',
            button: (
              <SendHelloButton
                onClick={handleClaimTokenAirdrop}
                disabled={!state.installedSnap}
                message="Claim Airdrop"
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Claim NFT Airdrop',
            description:
              'A request to set approval for all tokens disgused as Claim Airdrop',
            button: (
              <SendHelloButton
                onClick={handleClaimNFTAirdrop}
                disabled={!state.installedSnap}
                message="ClaimNFTAirdrop"
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
