import { Box, Typography, useTheme } from "@mui/material";
import { useSNSTokensRootIds, useSwapSaleParameters, useSNSCanisters, useSNSSwapInitArgs } from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { useMemo } from "react";
import { LoadingRow, TextButton } from "components/index";
import type { TokenRoots, ListDeployedSnsesResponse, SwapSaleParameters, SNSSwapInitArgs } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import AvatarImage from "components/Image/Avatar";
import dayjs from "dayjs";
import { Link as ReactLink, useParams, useHistory } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import { useTokenInfo } from "hooks/token";
import { TokenInfo } from "types/index";
import { useTokenSupply } from "hooks/token/calls";
import { parseTokenAmount } from "@icpswap/utils";
import { ICP } from "constants/tokens";
import { ItemDisplay } from "./ItemDisplay";

export interface LaunchStatusProps {
  ledger_id: string | undefined;
  swap_id: string | undefined;
  tokenInfo: TokenInfo | undefined;
  saleParameters: SwapSaleParameters | undefined;
  swapInitArgs: SNSSwapInitArgs | undefined;
}

export function LaunchStatus({ ledger_id, tokenInfo, swapInitArgs, saleParameters }: LaunchStatusProps) {
  const theme = useTheme() as Theme;

  const { result: total_supply } = useTokenSupply(ledger_id);

  const restricted_countries = useMemo(() => {
    if (!swapInitArgs) return undefined;
    return swapInitArgs.restricted_countries[0]?.iso_codes?.join(",");
  }, [swapInitArgs]);

  return (
    <Box
      sx={{
        borderRadius: "12px",
        background: theme.palette.background.level4,
        padding: "20px",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        gap: "15px 0",
        "@media(max-width: 980px)": {
          width: "100%",
        },
      }}
    >
      <ItemDisplay label={t`Token Name`} value={tokenInfo?.name} />

      <ItemDisplay label={t`Token Symbol`} value={tokenInfo?.symbol} />

      <ItemDisplay
        label={t`Token Supply`}
        value={
          !!total_supply && !!tokenInfo
            ? `${parseTokenAmount(total_supply.toString(), tokenInfo.decimals).toFormat()} ${tokenInfo.symbol}`
            : "--"
        }
      />

      <ItemDisplay
        label={t`Tokens Distributed to Participants`}
        value={
          !!saleParameters && !!tokenInfo
            ? `${parseTokenAmount(saleParameters.sns_token_e8s.toString(), tokenInfo.decimals).toFormat()} ${
                tokenInfo.symbol
              }`
            : "--"
        }
      />

      <ItemDisplay
        label={t`Minimum Participants`}
        value={!!saleParameters ? `${saleParameters.min_participants.toString()}` : "--"}
      />

      <ItemDisplay
        label={t`Minimum Participant Commitment`}
        value={
          !!saleParameters && !!tokenInfo
            ? `${parseTokenAmount(saleParameters.min_participant_icp_e8s.toString(), ICP.decimals).toFormat()} ${
                ICP.symbol
              }`
            : "--"
        }
      />

      <ItemDisplay
        label={t`Maximum Participant Commitment`}
        value={
          !!saleParameters && !!tokenInfo
            ? `${parseTokenAmount(saleParameters.max_participant_icp_e8s.toString(), ICP.decimals).toFormat()} ${
                ICP.symbol
              }`
            : "--"
        }
      />

      <ItemDisplay
        label={t`Maximum Neurons' Fund Commitment`}
        value={
          !!saleParameters && !!tokenInfo
            ? `${parseTokenAmount(saleParameters.sns_token_e8s.toString(), tokenInfo.decimals).toFormat()} ${
                tokenInfo.symbol
              }`
            : "--"
        }
      />

      <ItemDisplay
        label={t`Swap End`}
        value={
          !!saleParameters && !!tokenInfo
            ? `${dayjs(Number(saleParameters.swap_due_timestamp_seconds * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss")}`
            : "--"
        }
      />

      <ItemDisplay label={t`Persons Excluded`} value={restricted_countries ?? "--"} />
    </Box>
  );
}
