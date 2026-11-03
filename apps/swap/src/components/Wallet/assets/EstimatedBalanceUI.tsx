import { Flex } from "@icpswap/ui";
import { formatDollarTokenPrice, formatIcpAmount } from "@icpswap/utils";
import { Box, makeStyles, type Theme, Typography, useTheme } from "components/Mui";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { useWalletTokenStore } from "components/Wallet/token/store";
import { useCallback } from "react";
import { RotateCcw } from "react-feather";

const useStyles = makeStyles((theme: Theme) => {
  const isClassicDesign = theme.customization.designVersion === "classic";
  return {
    button: {
      background: isClassicDesign ? "#343D5E" : "color-mix(in srgb, var(--color-primary) 15%, var(--color-base-100))",
      borderRadius: isClassicDesign ? "12px" : "6px",
      ...(!isClassicDesign
        ? {
            border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
            transition: "background 150ms ease, border-color 150ms ease",
            "&:hover": {
              background: "color-mix(in srgb, var(--color-primary) 25%, var(--color-base-100))",
              borderColor: "var(--color-primary)",
            },
          }
        : {}),
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
  const isClassicDesign = useTheme().customization.designVersion === "classic";
  const { setPages } = useWalletStore();
  const { setTokenReceiveId } = useWalletTokenStore();

  const usdChangeType = valueChange?.includes("-") ? "down" : "up";
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
        borderRadius: isClassicDesign ? "16px" : "8px",
        background: isClassicDesign ? "#29314F" : "color-mix(in srgb, var(--color-primary) 18%, var(--color-base-100))",
        ...(!isClassicDesign
          ? { border: "1px solid color-mix(in srgb, var(--color-primary) 32%, var(--color-base-300))" }
          : {}),
        padding: "24px 16px 21px 16px",
      }}
    >
      <Flex fullWidth gap="0 8px">
        <Typography>{title}</Typography>
        <RotateCcw
          color={isClassicDesign ? "#ffffff" : "var(--color-primary)"}
          size={10}
          style={{ cursor: "pointer" }}
          onClick={onRefresh}
        />
      </Flex>

      <Box>
        <Box sx={{ margin: "10px 0 0 0" }}>
          <Typography
            component="span"
            sx={{ fontSize: "32px", fontWeight: 600 }}
            color={isClassicDesign ? "text.primary" : "var(--color-primary)"}
          >
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
