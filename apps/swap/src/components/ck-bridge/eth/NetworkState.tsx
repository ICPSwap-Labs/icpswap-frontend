import { Flex } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Box, Typography } from "components/Mui";
import { LinkButtons, LastSyncBlock, EthereumFinalizedBlock } from "components/ck-bridge";
import { useTranslation } from "react-i18next";

export interface EthNetworkStateProps {
  token: Token;
  minterInfo?: ChainKeyETHMinterInfo | Null;
}

export function EthNetworkState({ token, minterInfo }: EthNetworkStateProps) {
  const { t } = useTranslation();
  const ethHelperContract = minterInfo?.deposit_with_subaccount_helper_contract_address[0];

  return (
    <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
      <Typography sx={{ color: "text.primary", fontSize: "12px" }}>{t("common.network.state")}</Typography>

      <LinkButtons ckToken={token} contract={ethHelperContract} />

      <Box>
        <EthereumFinalizedBlock />
        {minterInfo ? (
          <Box sx={{ margin: "8px 0 0 0" }}>
            <LastSyncBlock minterInfo={minterInfo} />
          </Box>
        ) : null}
      </Box>
    </Flex>
  );
}
