import { ckBTC, ckETH } from "@icpswap/tokens";
import { Flex } from "@icpswap/ui";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import { AvatarImage } from "components/Image";
import { Typography } from "components/Mui";
import { useToken } from "hooks";
import { useErc20TokenFromSymbol } from "hooks/ck-bridge/useErc20TokenFromSymbol";
import { ArrowRight } from "react-feather";
import { BitcoinTransactionEvent, Erc20DissolveTransactionEvent, EthereumMintTransactionEvent } from "types/web3";

const CHIAN_ICP_LOGO = "/images/ck-bridge/chain-icp.svg";
const CHIAN_ETH_LOGO = "/images/ck-bridge/chain-eth.svg";
const CHAIN_BTC_LOGO = "/images/ck-bridge/chain-btc.svg";

interface TransactionEventUIProps {
  amount: string | undefined;
  logo0: string;
  logo1: string;
  tokenLogo: string | undefined;
}

function TransactionEventUI({ logo0, logo1, tokenLogo, amount }: TransactionEventUIProps) {
  return (
    <Flex gap="0 10px">
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
  event: EthereumMintTransactionEvent;
}

export function ETHTransactionEvent({ event }: ETHTransactionEventProps) {
  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
      tokenLogo={ckETH.logo}
      amount={formatAmount(parseTokenAmount(event.amount, ckETH.decimals).toString())}
    />
  );
}

interface Erc20DissolveTransactionEventUIProps {
  event: Erc20DissolveTransactionEvent;
}

export function Erc20DissolveTransactionEventUI({ event }: Erc20DissolveTransactionEventUIProps) {
  const token = useErc20TokenFromSymbol({ token_symbol: event.token_symbol });

  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
      tokenLogo={token?.logo}
      amount={token ? formatAmount(parseTokenAmount(event.amount, token.decimals).toString()) : undefined}
    />
  );
}

interface Erc20MintTransactionEventProps {
  event: EthereumMintTransactionEvent;
}

export function Erc20MintTransactionEvent({ event }: Erc20MintTransactionEventProps) {
  const [, token] = useToken(event.token);

  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
      tokenLogo={ckETH.logo}
      amount={token ? formatAmount(parseTokenAmount(event.amount, token.decimals).toString()) : undefined}
    />
  );
}

interface BtcTransactionEventProps {
  event: BitcoinTransactionEvent;
}

export function BtcTransactionEventUI({ event }: BtcTransactionEventProps) {
  return (
    <TransactionEventUI
      logo0={event.type === "mint" ? CHAIN_BTC_LOGO : CHIAN_ICP_LOGO}
      logo1={event.type === "mint" ? CHIAN_ICP_LOGO : CHAIN_BTC_LOGO}
      tokenLogo={ckBTC.logo}
      amount={formatAmount(parseTokenAmount(event.amount, ckBTC.decimals).toString())}
    />
  );
}
