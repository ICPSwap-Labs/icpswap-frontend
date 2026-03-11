import { BridgeType, BridgeChainType } from "@icpswap/constants";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import { useToken } from "hooks";
import { useErc20TokenFromSymbol } from "hooks/ck-bridge/useErc20TokenFromSymbol";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Erc20DissolveTransactionEvent, EthereumTransactionEvent } from "types/web3";
import { EthereumMintConfirmations } from "components/ck-bridge/ui/confirmations/ETHConfirmations";
import { Erc20DissolveConfirmations } from "components/ck-bridge/ui/confirmations/Erc20Confirmations";
import { Divider } from "components/ck-bridge/ui/events/Divider";
import { TransactionEventUI } from "components/ck-bridge/ui/events/TransactionEvent";
import { CHIAN_ICP_LOGO, CHIAN_ETH_LOGO } from "components/ck-bridge/ui/events/config";

interface Erc20DissolveTransactionEventUIProps {
  event: Erc20DissolveTransactionEvent;
}

export function Erc20DissolveTransactionEventUI({ event }: Erc20DissolveTransactionEventUIProps) {
  const token = useErc20TokenFromSymbol({ token_symbol: event.token_symbol });
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    if (!token) return;
    navigate(`/ck-bridge?tokenId=${token.address}&chainType=${BridgeChainType.icp}`);
  }, [navigate, token]);

  return (
    <>
      <TransactionEventUI
        logo0={event.type === BridgeType.mint ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
        logo1={event.type === BridgeType.mint ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
        tokenLogo={token?.logo}
        amount={token ? formatAmount(parseTokenAmount(event.amount, token.decimals).toString()) : undefined}
        onClick={handleClick}
      />

      <Divider />

      <Erc20DissolveConfirmations withdraw_id={event.withdrawal_id} />
    </>
  );
}

interface Erc20MintTransactionEventProps {
  event: EthereumTransactionEvent;
}

export function Erc20MintTransactionEvent({ event }: Erc20MintTransactionEventProps) {
  const [, token] = useToken(event.token);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`/ck-bridge?tokenId=${event.token}&chainType=${BridgeChainType.erc20}`);
  }, [navigate, event]);

  return (
    <>
      <TransactionEventUI
        logo0={event.type === BridgeType.mint ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
        logo1={event.type === BridgeType.mint ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
        tokenLogo={token?.logo}
        amount={token ? formatAmount(parseTokenAmount(event.amount, token.decimals).toString()) : undefined}
        onClick={handleClick}
      />

      <Divider />

      {event.hash ? <EthereumMintConfirmations hash={event.hash} erc20 /> : null}
    </>
  );
}
