import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { ckDoge } from "@icpswap/tokens";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DogeTransactionEvent as DogeTransactionEventType } from "types/web3";
import {
  DogeDissolveConfirmations,
  DogeMintConfirmations,
} from "components/ck-bridge/ui/confirmations/DogeConfirmations";
import { Divider } from "components/ck-bridge/ui/events/Divider";
import { TransactionEventUI } from "components/ck-bridge/ui/events/TransactionEvent";
import { CHIAN_ICP_LOGO, CHAIN_DOGE_LOGO } from "components/ck-bridge/ui/events/config";

interface DogeTransactionEventProps {
  event: DogeTransactionEventType;
}

export function DogeTransactionEvent({ event }: DogeTransactionEventProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(
      `/ck-bridge?tokenId=${ckDoge.address}&chainType=${
        event.type === BridgeType.mint ? BridgeChainType.doge : BridgeChainType.icp
      }`,
    );
  }, [navigate, event]);

  return (
    <>
      <TransactionEventUI
        logo0={event.type === BridgeType.mint ? CHAIN_DOGE_LOGO : CHIAN_ICP_LOGO}
        logo1={event.type === BridgeType.mint ? CHIAN_ICP_LOGO : CHAIN_DOGE_LOGO}
        tokenLogo={ckDoge.logo}
        amount={formatAmount(parseTokenAmount(event.amount, ckDoge.decimals).toString())}
        onClick={handleClick}
      />

      <Divider />

      {event.type === BridgeType.mint ? (
        event.hash ? (
          <DogeMintConfirmations hash={event.hash} />
        ) : null
      ) : (
        <DogeDissolveConfirmations hash={event.hash} />
      )}
    </>
  );
}
