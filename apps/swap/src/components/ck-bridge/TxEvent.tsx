import { ckBridgeChain } from "@icpswap/constants";
import { ckBTC, ckETH } from "@icpswap/tokens";
import { Flex } from "@icpswap/ui";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import { AvatarImage } from "components/Image";
import { Typography } from "components/Mui";
import { useToken } from "hooks";
import { useErc20TokenFromSymbol } from "hooks/ck-bridge/useErc20TokenFromSymbol";
import { useCallback } from "react";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import { BitcoinTransactionEvent, Erc20DissolveTransactionEvent, EthereumTransactionEvent } from "types/web3";

const CHIAN_ICP_LOGO = "/images/ck-bridge/chain-icp.svg";
const CHIAN_ETH_LOGO = "/images/ck-bridge/chain-eth.svg";
const CHAIN_BTC_LOGO = "/images/ck-bridge/chain-btc.svg";

interface TransactionEventUIProps {
  amount: string | undefined;
  logo0: string;
  logo1: string;
  tokenLogo: string | undefined;
  onClick?: () => void;
}

function TransactionEventUI({ logo0, logo1, tokenLogo, amount, onClick }: TransactionEventUIProps) {
  return (
    <Flex gap="0 10px" onClick={onClick} sx={{ cursor: "pointer" }}>
      <Flex gap="0 4px">
        <AvatarImage src={logo0} sx={{ width: "16px", height: "16px", borderRadius: "4px" }} />
        <ArrowRight size={14} />
        <AvatarImage src={logo1} sx={{ width: "16px", height: "16px", borderRadius: "4px" }} />
      </Flex>

      <Flex gap="0 4px">
        <AvatarImage src={tokenLogo} sx={{ width: "16px", height: "16px" }} />
        <Typography sx={{ fontSize: "12px" }}>{amount}</Typography>
      </Flex>
    </Flex>
  );
}

interface ETHTransactionEventProps {
  event: EthereumTransactionEvent;
}

export function ETHTransactionEvent({ event }: ETHTransactionEventProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(
      `/ck-bridge?tokenId=${ckETH.address}&chain=${event.type === "mint" ? ckBridgeChain.eth : ckBridgeChain.icp}`,
    );
  }, [navigate]);

  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
      tokenLogo={ckETH.logo}
      amount={formatAmount(parseTokenAmount(event.amount, ckETH.decimals).toString())}
      onClick={handleClick}
    />
  );
}

interface Erc20DissolveTransactionEventUIProps {
  event: Erc20DissolveTransactionEvent;
}

export function Erc20DissolveTransactionEventUI({ event }: Erc20DissolveTransactionEventUIProps) {
  const token = useErc20TokenFromSymbol({ token_symbol: event.token_symbol });
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    if (!token) return;
    navigate(`/ck-bridge?tokenId=${token.address}&chain=${ckBridgeChain.icp}`);
  }, [navigate, token]);
  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
      tokenLogo={token?.logo}
      amount={token ? formatAmount(parseTokenAmount(event.amount, token.decimals).toString()) : undefined}
      onClick={handleClick}
    />
  );
}

interface Erc20MintTransactionEventProps {
  event: EthereumTransactionEvent;
}

export function Erc20MintTransactionEvent({ event }: Erc20MintTransactionEventProps) {
  const [, token] = useToken(event.token);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`/ck-bridge?tokenId=${event.token}&chain=${ckBridgeChain.eth}`);
  }, [navigate, event]);

  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
      tokenLogo={token?.logo}
      amount={token ? formatAmount(parseTokenAmount(event.amount, token.decimals).toString()) : undefined}
      onClick={handleClick}
    />
  );
}

interface BtcTransactionEventProps {
  event: BitcoinTransactionEvent;
}

export function BtcTransactionEventUI({ event }: BtcTransactionEventProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(
      `/ck-bridge?tokenId=${ckBTC.address}&chain=${event.type === "mint" ? ckBridgeChain.btc : ckBridgeChain.icp}`,
    );
  }, [navigate, event]);

  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHAIN_BTC_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHAIN_BTC_LOGO}
      tokenLogo={ckBTC.logo}
      amount={formatAmount(parseTokenAmount(event.amount, ckBTC.decimals).toString())}
      onClick={handleClick}
    />
  );
}
