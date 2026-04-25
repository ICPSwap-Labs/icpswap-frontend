import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { ckETH } from "@icpswap/tokens";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import {
  EthereumDissolveConfirmations,
  EthereumMintConfirmations,
} from "components/ck-bridge/ui/confirmations/ETHConfirmations";
import { CHIAN_ETH_LOGO, CHIAN_ICP_LOGO } from "components/ck-bridge/ui/events/config";
import { Divider } from "components/ck-bridge/ui/events/Divider";
import { TransactionEventUI } from "components/ck-bridge/ui/events/TransactionEvent";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { EthereumTransactionEvent } from "types/web3";

interface ETHTransactionEventProps {
  event: EthereumTransactionEvent;
}

export function ETHTransactionEvent({ event }: ETHTransactionEventProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(
      `/ck-bridge?tokenId=${ckETH.address}&chainType=${
        event.type === BridgeType.mint ? BridgeChainType.eth : BridgeChainType.icp
      }`,
    );
  }, [navigate, event.type]);

  return (
    <>
      <TransactionEventUI
        logo0={event.type === BridgeType.mint ? CHIAN_ETH_LOGO : CHIAN_ICP_LOGO}
        logo1={event.type === BridgeType.mint ? CHIAN_ICP_LOGO : CHIAN_ETH_LOGO}
        tokenLogo={ckETH.logo}
        amount={formatAmount(parseTokenAmount(event.amount, ckETH.decimals).toString())}
        onClick={handleClick}
      />

      <Divider />

      {event.type === BridgeType.dissolve ? (
        <EthereumDissolveConfirmations hash={event.hash} />
      ) : event.hash ? (
        <EthereumMintConfirmations hash={event.hash} />
      ) : null}
    </>
  );
}
