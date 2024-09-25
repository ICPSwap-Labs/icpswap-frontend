import { Token } from "@icpswap/swap-sdk";
import { Trans } from "@lingui/macro";
import { Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { ckBTC_MINTER_ID, ckBTC_DASHBOARD } from "constants/ckBTC";
import { explorerLink } from "@icpswap/utils";

import { LinkButton } from "../LinkButton";

interface BtcBridgeNetworkStateProps {
  token: Token;
  block: number | undefined;
}

export function BtcBridgeNetworkState({ token, block }: BtcBridgeNetworkStateProps) {
  return (
    <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
      <Typography sx={{ color: "text.primary", fontSize: "12px" }}>
        <Trans>Network State</Trans>
      </Typography>

      <Flex gap="0 8px" wrap="wrap">
        <LinkButton link={explorerLink(ckBTC_MINTER_ID)} label={<Trans>{token.symbol} canister</Trans>} />
        <LinkButton link={ckBTC_DASHBOARD} label={<Trans>{token.symbol} Dashboard</Trans>} />
      </Flex>

      {block ? (
        <Typography fontSize="12px">
          <Trans>Bitcoin network block height: </Trans> {block}
        </Typography>
      ) : null}
    </Flex>
  );
}
