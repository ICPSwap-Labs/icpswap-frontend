import { useContext, useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { BigNumber, formatDollarAmount, principalToAccount } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import WalletContext from "./context";
import { useSuccessTip } from "hooks/useTips";
import { useICPPrice } from "hooks/useUSDPrice";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { useAccountPrincipal } from "store/auth/hooks";
import Copy, { CopyRef } from "components/Copy";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh.svg";

export interface AddressWrapperProps {
  address: string | undefined;
  label: string;
}

export function AddressWrapper({ address, label }: AddressWrapperProps) {
  const copyRef = useRef<CopyRef>(null);

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "286px",
        borderRadius: "8px",
        padding: "12px",
        border: "1px solid #29314F",
        height: "fit-content",
        "@media(max-width: 640px)": {
          maxWidth: "100%",
        },
      }}
    >
      <Box
        sx={{
          width: "70px",
          height: "20px",
          borderRadius: "30px",
          background: "#29314F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "12px", transform: "scale(0.9)" }}>{label}</Typography>
      </Box>

      <Box sx={{ margin: "8px 0 0 0", wordBreak: "break-all" }}>
        <Typography
          sx={{ fontSize: "12px", whiteSpace: "break-spaces", cursor: "pointer", userSelect: "none" }}
          component="span"
          onClick={handleCopy}
        >
          {address}
        </Typography>
        <Box component="span" sx={{ cursor: "pointer" }} onClick={handleCopy}>
          <CopyIcon />
        </Box>
      </Box>

      <Copy content={address ?? ""} hide ref={copyRef} />
    </Box>
  );
}

export default function WalletAccount() {
  const icpPrice = useICPPrice();

  const principal = useAccountPrincipal();
  const [openSuccessTip] = useSuccessTip();

  const {
    refreshTotalBalance,
    setRefreshTotalBalance,
    refreshCounter,
    setRefreshCounter,
    totalValue,
    totalUSDBeforeChange,
  } = useContext(WalletContext);

  const useTotalICPValue = useMemo(() => {
    if (icpPrice) return totalValue.dividedBy(icpPrice);
    return undefined;
  }, [totalValue, icpPrice]);

  const usdChange = useMemo(() => {
    if (totalValue.isEqualTo(0) || totalUSDBeforeChange.isEqualTo(0)) return undefined;
    return `${totalValue.minus(totalUSDBeforeChange).dividedBy(totalUSDBeforeChange).multipliedBy(100).toFixed(2)}%`;
  }, [totalUSDBeforeChange, totalValue]);

  const usdChangeType = new BigNumber(usdChange ?? 0).isLessThan(0) ? "down" : "up";
  const USDChangeColor = usdChangeType === "up" ? "#54C081" : "#D3625B";

  const handleRefreshBalance = () => {
    if (setRefreshTotalBalance) setRefreshTotalBalance(!refreshTotalBalance);
    setRefreshCounter(refreshCounter + 1);
    openSuccessTip("Refresh Success");
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        padding: "0 0 30px 0",
        borderBottom: "1px solid #29314F",
        "@media(max-width: 640px)": {
          flexDirection: "column",
          gap: "20px 0",
        },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
          <Typography>
            <Trans>Estimated Balance</Trans>
          </Typography>

          <RefreshIcon style={{ cursor: "pointer" }} onClick={handleRefreshBalance} />
        </Box>

        <Box sx={{ margin: "10px 0 0 0" }}>
          <Typography sx={{ fontSize: "32px", fontWeight: 600 }} color="text.primary">
            ≈{useTotalICPValue ? useTotalICPValue.toFormat(4) : 0}&nbsp;
            <Typography component="span" sx={{ fontSize: "24px" }} color="text.primary">
              ICP
            </Typography>
          </Typography>
        </Box>

        <Box sx={{ margin: "6px 0 0 0" }}>
          <Typography component="span">≈{formatDollarAmount(totalValue.toString(), 2)}</Typography>
          <Typography sx={{ margin: "0 0 0 10px", color: USDChangeColor }} component="span">
            {usdChange ? `${usdChangeType === "down" ? "-" : "+"}${usdChange}` : "--"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "0 12px",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "20px 0",
          },
        }}
      >
        <Box
          sx={{
            minWidth: "286px",
            "@media(max-width: 640px)": {
              minWidth: "100%",
            },
          }}
        >
          <AddressWrapper
            address={principal ? principalToAccount(principal?.toString()) : "--"}
            label={t`Account ID`}
          />
        </Box>
        <Box
          sx={{
            minWidth: "286px",
            "@media(max-width: 640px)": {
              minWidth: "100%",
            },
          }}
        >
          <AddressWrapper address={principal ? principal.toString() : "--"} label={t`Principal ID`} />
        </Box>
      </Box>
    </Box>
  );
}
