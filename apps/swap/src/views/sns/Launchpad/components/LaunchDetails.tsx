import { Box, useTheme } from "components/Mui";
import { useMemo } from "react";
import type { SwapSaleParameters, SNSSwapInitArgs } from "@icpswap/types";
import dayjs from "dayjs";
import { useTokenSupply } from "hooks/token/calls";
import { parseTokenAmount } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

import { ItemDisplay } from "./ItemDisplay";

export interface LaunchDetailProps {
  ledger_id: string | undefined;
  swap_id: string | undefined;
  token: Token | undefined;
  saleParameters: SwapSaleParameters | undefined;
  swapInitArgs: SNSSwapInitArgs | undefined;
}

export function LaunchDetail({ ledger_id, token, swapInitArgs, saleParameters }: LaunchDetailProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
      <ItemDisplay label={t("common.token.name")} value={token?.name} />

      <ItemDisplay label={t("common.token.symbol")} value={token?.symbol} />

      <ItemDisplay
        label={t("common.token.supply")}
        value={
          !!total_supply && !!token
            ? `${parseTokenAmount(total_supply.toString(), token.decimals).toFormat()} ${token.symbol}`
            : "--"
        }
      />

      <ItemDisplay
        label={t("nns.tokens.distributed.participants")}
        value={
          !!saleParameters && !!token
            ? `${parseTokenAmount(saleParameters.sns_token_e8s.toString(), token.decimals).toFormat()} ${token.symbol}`
            : "--"
        }
      />

      <ItemDisplay
        label={t("launch.minimum.participants")}
        value={saleParameters ? `${saleParameters.min_participants.toString()}` : "--"}
      />

      <ItemDisplay
        label={t("nns.minimum.participant.commitment")}
        value={
          !!saleParameters && !!token
            ? `${parseTokenAmount(saleParameters.min_participant_icp_e8s.toString(), ICP.decimals).toFormat()} ${
                ICP.symbol
              }`
            : "--"
        }
      />

      <ItemDisplay
        label={t("launch.maximum.participant")}
        value={
          !!saleParameters && !!token
            ? `${parseTokenAmount(saleParameters.max_participant_icp_e8s.toString(), ICP.decimals).toFormat()} ${
                ICP.symbol
              }`
            : "--"
        }
      />

      <ItemDisplay
        label={t("launch.maximum.neurons.commitment")}
        value={
          !!saleParameters && !!token
            ? `${parseTokenAmount(saleParameters.sns_token_e8s.toString(), token.decimals).toFormat()} ${token.symbol}`
            : "--"
        }
      />

      <ItemDisplay
        label={t("nns.swap.end")}
        value={
          saleParameters
            ? `${dayjs(Number(saleParameters.swap_due_timestamp_seconds * BigInt(1000))).format("YYYY-MM-DD HH:mm:ss")}`
            : "--"
        }
      />

      <ItemDisplay label={t("nns.persons.excluded")} value={restricted_countries ?? "--"} />
    </Box>
  );
}
