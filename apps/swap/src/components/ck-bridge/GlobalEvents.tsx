import { Flex } from "@icpswap/ui";
import { Box, Typography, useTheme } from "components/Mui";
import { useAllEvents } from "hooks/ck-bridge/useAllEvents";
import { useBridgeWatcher } from "hooks/ck-bridge/useBridgeWatcher";
import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import {
  Erc20DissolveTransactionEventUI,
  ETHTransactionEvent,
  Erc20MintTransactionEvent,
  BtcTransactionEventUI,
} from "components/ck-bridge/TxEvent";
import {
  Erc20DissolveConfirmations,
  EthereumConfirmations,
  BitcoinDissolveConfirmations,
  BitcoinMintConfirmations,
} from "components/ck-bridge/TxConfirmation";
import {
  isBtcTransactionEvent,
  isErc20DissolveTransactionEvent,
  isErc20MintTransactionEvent,
  isEthTransactionEvent,
} from "utils/web3/ck-bridge";
import { isUndefinedOrNull } from "@icpswap/utils";

interface PaginationProps {
  total: number;
  current: number;
  onNext: (index: number) => void;
  onPrev: (index: number) => void;
}

function Pagination({ total, current, onNext, onPrev }: PaginationProps) {
  const handlePrev = useCallback(() => {
    if (current === 0) {
      onPrev(total - 1);
    } else {
      onPrev(current - 1);
    }
  }, [total, current, onNext]);

  const handleNext = useCallback(() => {
    if (current === total - 1) {
      onNext(0);
    } else {
      onNext(current + 1);
    }
  }, [total, current, onNext]);

  return (
    <Flex gap="0 10px">
      <ChevronLeft size={14} style={{ cursor: "pointer" }} onClick={handlePrev} />
      <Flex>
        <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{current + 1}</Typography>
        <Typography sx={{ fontSize: "12px" }}>/</Typography>
        <Typography sx={{ fontSize: "12px" }}>{total}</Typography>
      </Flex>
      <ChevronRight size={14} style={{ cursor: "pointer" }} onClick={handleNext} />
    </Flex>
  );
}

function Divider() {
  const theme = useTheme();

  return <Box sx={{ background: theme.palette.background.level4, width: "1px", height: "12px" }} />;
}

export function CkGlobalEvents() {
  const theme = useTheme();

  useBridgeWatcher();

  const allEvents = useAllEvents();

  const [current, setCurrent] = useState<number>(0);

  const currentEvent = useMemo(() => {
    const event = allEvents[current];

    if (isUndefinedOrNull(event)) {
      setCurrent(0);
      return allEvents[0];
    }

    return event;
  }, [current, allEvents]);

  return isUndefinedOrNull(currentEvent) ? null : (
    <Box
      sx={{
        padding: "0 12px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        gap: "0 10px",
        borderRadius: "48px",
        background: theme.palette.background.level3,
        "@media(max-width: 640px)": {
          maxWidth: "330px",
        },
      }}
    >
      <Pagination total={allEvents.length} current={current} onNext={setCurrent} onPrev={setCurrent} />
      <Divider />
      {isEthTransactionEvent(currentEvent) ? (
        <ETHTransactionEvent event={currentEvent} />
      ) : isErc20DissolveTransactionEvent(currentEvent) ? (
        <Erc20DissolveTransactionEventUI event={currentEvent} />
      ) : isErc20MintTransactionEvent(currentEvent) ? (
        <Erc20MintTransactionEvent event={currentEvent} />
      ) : isBtcTransactionEvent(currentEvent) ? (
        <BtcTransactionEventUI event={currentEvent} />
      ) : null}
      <Divider />
      {currentEvent.chain === "eth" || currentEvent.chain === "erc20" ? (
        isErc20DissolveTransactionEvent(currentEvent) ? (
          <Erc20DissolveConfirmations withdraw_id={currentEvent.withdrawal_id} />
        ) : currentEvent.hash ? (
          <EthereumConfirmations hash={currentEvent.hash} />
        ) : null
      ) : currentEvent.chain === "btc" ? (
        currentEvent.type === "mint" ? (
          currentEvent.hash ? (
            <BitcoinMintConfirmations hash={currentEvent.hash} />
          ) : null
        ) : (
          <BitcoinDissolveConfirmations hash={currentEvent.hash} />
        )
      ) : null}
    </Box>
  );
}
