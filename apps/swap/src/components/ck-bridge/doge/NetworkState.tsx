import { Token } from "@icpswap/swap-sdk";
import { Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { DOGE_MINTER_ID } from "@icpswap/constants";
import { icDashboardExplorerLink } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { LinkButton } from "components/ck-bridge/LinkButton";

interface BridgeNetworkStateProps {
  token: Token;
  block: number | undefined;
}

export function BridgeNetworkState({ token, block }: BridgeNetworkStateProps) {
  const { t } = useTranslation();

  return (
    <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
      <Typography sx={{ color: "text.primary", fontSize: "12px" }}>{t("common.network.state")}</Typography>

      <Flex gap="0 8px" wrap="wrap">
        <LinkButton
          link={icDashboardExplorerLink(DOGE_MINTER_ID)}
          label={t("token.canister", { symbol: token.symbol })}
        />
        <LinkButton
          link="https://dashboard.internetcomputer.org/canister/gordg-fyaaa-aaaan-aaadq-cai"
          label={t("token.dashboard", { symbol: token.symbol })}
        />
      </Flex>

      {block ? <Typography fontSize="12px">{t("chain.network.block", { chainName: "Doge", block })}</Typography> : null}
    </Flex>
  );
}
