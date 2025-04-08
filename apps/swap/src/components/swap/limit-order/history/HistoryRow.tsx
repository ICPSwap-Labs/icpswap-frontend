import { useState, useCallback, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { LimitTransaction } from "@icpswap/types";
import { TokenImage } from "components/index";
import dayjs from "dayjs";
import { useToken } from "hooks/index";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";

export interface HistoryRowProps {
  transaction: LimitTransaction;
  wrapperClasses?: string;
}

export function HistoryRow({ transaction, wrapperClasses }: HistoryRowProps) {
  const theme = useTheme();

  const [invertPrice, setInvertPrice] = useState(false);

  const { inputTokenId, outputTokenId, inputAmount, outputChangeAmount } = useMemo(() => {
    const inputTokenId = new BigNumber(transaction.token0InAmount).isEqualTo(0)
      ? transaction.token1Id
      : transaction.token0Id;

    const outputTokenId = inputTokenId === transaction.token1Id ? transaction.token0Id : transaction.token1Id;
    const inputAmount = inputTokenId === transaction.token1Id ? transaction.token1InAmount : transaction.token0InAmount;
    const outputChangeAmount =
      inputTokenId === transaction.token1Id ? transaction.token0ChangeAmount : transaction.token1ChangeAmount;

    return {
      inputTokenId,
      outputTokenId,
      inputAmount,
      outputChangeAmount,
    };
  }, [transaction]);

  const [, inputToken] = useToken(inputTokenId);
  const [, outputToken] = useToken(outputTokenId);

  const limitPrice = useMemo(() => {
    if (!outputToken) return undefined;
    return new BigNumber(outputChangeAmount).dividedBy(inputAmount).toFixed(outputToken.decimals);
  }, [outputChangeAmount, outputToken, inputAmount]);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  return (
    <>
      <Box
        className={wrapperClasses}
        sx={{
          background: theme.palette.background.level3,
          padding: "20px 16px",
          borderRadius: "12px",
          width: "100%",
          "&:hover": {
            background: theme.palette.background.level4,
          },
        }}
      >
        <Flex>
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {dayjs(Number(transaction.timestamp * BigInt(1000))).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Flex>

        <Flex gap="0 6px">
          <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {toSignificantWithGroupSeparator(inputAmount)} {inputToken?.symbol}
          </Typography>
        </Flex>

        <Flex gap="0 6px">
          <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {toSignificantWithGroupSeparator(outputChangeAmount)} {outputToken?.symbol}
          </Typography>
        </Flex>

        <Flex gap="0 2px" justify="flex-end">
          <Typography
            sx={{ color: "text.primary", cursor: "pointer", display: "flex", gap: "0 2px", alignItems: "center" }}
            component="div"
            onClick={handleInvert}
          >
            {limitPrice ? (
              <>
                {invertPrice
                  ? `1 ${outputToken?.symbol} = ${toSignificantWithGroupSeparator(
                      new BigNumber(1).dividedBy(limitPrice).toString(),
                    )} ${inputToken?.symbol}`
                  : `1 ${inputToken?.symbol} = ${limitPrice} ${outputToken?.symbol}`}
                <SyncAltIcon sx={{ fontSize: "1rem" }} />
              </>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>
      </Box>
    </>
  );
}
