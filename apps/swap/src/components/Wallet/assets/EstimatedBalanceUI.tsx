import { useCallback } from "react";
import { Box, Typography, makeStyles } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { RotateCcw } from "react-feather";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { formatDollarTokenPrice, formatIcpAmount } from "@icpswap/utils";

const useStyles = makeStyles(() => {
  return {
    button: {
      background: "#343D5E",
      borderRadius: "12px",
      height: "36px",
      width: "50%",
      justifyContent: "center",
      cursor: "pointer",
    },
  };
});

export interface EstimatedBalanceUIProps {
  title: string;
  usdValue: string | undefined;
  icpValue: string | undefined;
  valueChange?: string | undefined;
  showButtons?: boolean;
  onRefresh?: () => void;
  noValueChange?: boolean;
}

export function EstimatedBalanceUI({
  title,
  usdValue,
  icpValue,
  valueChange,
  showButtons,
  onRefresh,
  noValueChange,
}: EstimatedBalanceUIProps) {
  const classes = useStyles();
  const { setTokenReceiveId, setPages } = useWalletContext();

  const usdChangeType = valueChange && valueChange.includes("-") ? "down" : "up";
  const USDChangeColor = usdChangeType === "up" ? "#54C081" : "#D3625B";

  const handleReceive = useCallback(() => {
    setTokenReceiveId(undefined);
    setPages(WalletManagerPage.Receive);
  }, [setTokenReceiveId, setPages]);

  const handleSend = useCallback(() => {
    setPages(WalletManagerPage.Send);
  }, [setPages]);

  return (
    <Box
      sx={{
        borderRadius: "16px",
        background: "#29314F",
        padding: "24px 16px 21px 16px",
      }}
    >
      <Flex fullWidth gap="0 8px">
        <Typography>{title}</Typography>
        <RotateCcw color="#ffffff" size={10} style={{ cursor: "pointer" }} onClick={onRefresh} />
      </Flex>

      <Box>
        <Box sx={{ margin: "10px 0 0 0" }}>
          <Typography component="span" sx={{ fontSize: "32px", fontWeight: 600 }} color="text.primary">
            {usdValue ? `≈${formatDollarTokenPrice(usdValue, { min: 0.01 })}` : "--"}
          </Typography>
        </Box>

        <Box sx={{ margin: "6px 0 0 0", display: "flex", gap: "0 8px", alignItems: "center" }}>
          <Typography>≈{icpValue ? formatIcpAmount(icpValue.toString()) : 0}&nbsp;ICP</Typography>
          {!noValueChange ? (
            <Typography sx={{ color: USDChangeColor }} component="span">
              {valueChange ? `${usdChangeType === "down" ? "" : "+"}${valueChange}` : "--"}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {showButtons ? (
        <Flex sx={{ margin: "35px 0 0 0", gap: "0 8px" }}>
          <Flex gap="0 8px" className={classes.button} onClick={handleReceive}>
            <img src="/images/wallet/arrow01.svg" alt="" />
            <Typography color="text.primary">Receive</Typography>
          </Flex>

          <Flex gap="0 8px" className={classes.button} onClick={handleSend}>
            <img src="/images/wallet/arrow01.svg" alt="" style={{ transform: "rotate(180deg)" }} />
            <Typography color="text.primary">Send</Typography>
          </Flex>
        </Flex>
      ) : null}
    </Box>
  );
}
