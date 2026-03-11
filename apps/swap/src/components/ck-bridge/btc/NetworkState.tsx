import { Token } from "@icpswap/swap-sdk";
import { Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { BITCOIN_DASHBOARD } from "constants/chain-key";
import { BridgeChainName, ckBTC_MINTER_ID } from "@icpswap/constants";
import { icDashboardExplorerLink } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { LinkButton } from "components/ck-bridge/LinkButton";

interface BtcBridgeNetworkStateProps {
  token: Token;
  block: number | undefined;
}

export function BtcBridgeNetworkState({ token, block }: BtcBridgeNetworkStateProps) {
  const { t } = useTranslation();

  return (
    <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
      <Typography sx={{ color: "text.primary", fontSize: "12px" }}>{t("common.network.state")}</Typography>

      <Flex gap="0 8px" wrap="wrap">
        <LinkButton
          link={icDashboardExplorerLink(ckBTC_MINTER_ID)}
          label={t("token.canister", { symbol: token.symbol })}
        />
        <LinkButton link={BITCOIN_DASHBOARD} label={t("token.dashboard", { symbol: token.symbol })} />
      </Flex>

      {block ? (
        <Typography fontSize="12px">
          {t("chain.network.block", { chainName: BridgeChainName.bitcoin, block })}
        </Typography>
      ) : null}
    </Flex>
  );
}
