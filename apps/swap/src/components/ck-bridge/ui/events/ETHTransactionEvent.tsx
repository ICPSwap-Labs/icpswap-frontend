import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { ckETH } from "@icpswap/tokens";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EthereumTransactionEvent } from "types/web3";
import {
  EthereumMintConfirmations,
  EthereumDissolveConfirmations,
} from "components/ck-bridge/ui/confirmations/ETHConfirmations";
import { Divider } from "components/ck-bridge/ui/events/Divider";
import { TransactionEventUI } from "components/ck-bridge/ui/events/TransactionEvent";
import { CHIAN_ICP_LOGO, CHIAN_ETH_LOGO } from "components/ck-bridge/ui/events/config";

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
  }, [navigate]);

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
