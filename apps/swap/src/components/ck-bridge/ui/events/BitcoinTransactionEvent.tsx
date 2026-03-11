import { BridgeType, BridgeChainType } from "@icpswap/constants";
import { ckBTC } from "@icpswap/tokens";
import { formatAmount, parseTokenAmount } from "@icpswap/utils";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BitcoinTransactionEvent as BitcoinTransactionEventType } from "types/web3";
import {
  BitcoinDissolveConfirmations,
  BitcoinMintConfirmations,
} from "components/ck-bridge/ui/confirmations/BitcoinConfirmations";
import { Divider } from "components/ck-bridge/ui/events/Divider";
import { TransactionEventUI } from "components/ck-bridge/ui/events/TransactionEvent";
import { CHIAN_ICP_LOGO, CHAIN_BTC_LOGO } from "components/ck-bridge/ui/events/config";

interface BitcoinTransactionEventProps {
  event: BitcoinTransactionEventType;
}

export function BitcoinTransactionEvent({ event }: BitcoinTransactionEventProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(
      `/ck-bridge?tokenId=${ckBTC.address}&chainType=${
        event.type === BridgeType.mint ? BridgeChainType.btc : BridgeChainType.icp
      }`,
    );
  }, [navigate, event]);

  return (
    <>
      <TransactionEventUI
        logo0={event.type === BridgeType.mint ? CHAIN_BTC_LOGO : CHIAN_ICP_LOGO}
        logo1={event.type === BridgeType.mint ? CHIAN_ICP_LOGO : CHAIN_BTC_LOGO}
        tokenLogo={ckBTC.logo}
        amount={formatAmount(parseTokenAmount(event.amount, ckBTC.decimals).toString())}
        onClick={handleClick}
      />

      <Divider />

      {event.type === BridgeType.mint ? (
        event.hash ? (
          <BitcoinMintConfirmations hash={event.hash} />
        ) : null
      ) : (
        <BitcoinDissolveConfirmations hash={event.hash} />
      )}
    </>
  );
}
