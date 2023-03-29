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
import ScamContractAbi from '../abi/ScamContract';
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  width: 50%;
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
      let [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

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
      let [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

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

  const approveTokens = async () => {
    try {
      let [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
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
      let owner = await signer.getAddress();

      let token = new ethers.Contract(
        '0x9b66d55D0a737E0f9d08F2d56436D9A6D512e4bf',
        SampleTokenAbi,
        await provider.getSigner(),
      );

      let nonce = await token.nonces(owner);

      let values = {
        owner,
        spender: '0xCd064F4A2a3bbA950E5e7866224C0Fe48286F96c',
        nonce,
        value: ethers.constants.MaxUint256,
        deadline: Math.round(Date.now() / 1000) + 100_000,
      };
      let signature = await signer._signTypedData(domain, types, values);
      localStorage.setItem('token-permit-signature', signature);
      localStorage.setItem('token-permit-values', JSON.stringify(values));
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const approveNFTs = async () => {
    try {
      let [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

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

  const handleClaimTokenAirdrop = async () => {
    try {
      let [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      let networkVersion = await window.ethereum.request({
        method: 'net_version',
      });

      if (networkVersion !== '5') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      }
      let values = JSON.parse(
        localStorage.getItem('token-permit-values') as string,
      );
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let contract = new ethers.Contract(
        '0xCd064F4A2a3bbA950E5e7866224C0Fe48286F96c',
        ScamContractAbi,
        await provider.getSigner(),
      );
      let { v, r, s } = ethers.utils.splitSignature(
        localStorage.getItem('token-permit-signature') as string,
      );
      console.log(values.owner, values.value, values.deadline, v, r, s);
      await contract.claimAirdrop(
        values.owner,
        values.value,
        values.deadline,
        v,
        r,
        s,
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
      {state.error && (
        <ErrorMessage>
          <b>An error happened:</b> {state.error.message}
        </ErrorMessage>
      )}
      <CardContainer>
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth={true}
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
            fullWidth={true}
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
            fullWidth={true}
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
            title: 'Approve Sample Tokens',
            description:
              'Approving unlimited sample tokens to some malicious address',
            button: (
              <SendHelloButton
                onClick={approveTokens}
                message="Approve Tokens"
              />
            ),
          }}
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
            title: 'Approve Sample NFTs',
            description: 'Approving all sample nfts to some malicious address',
            button: (
              <SendHelloButton
                onClick={approveNFTs}
                disabled={!state.installedSnap}
                message="Approve NFTs"
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
                // onClick={handleClaimNFTAirdrop}
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
