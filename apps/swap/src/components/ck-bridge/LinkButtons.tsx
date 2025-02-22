import { getExplorerAddress, getIcDashboard } from "constants/web3";
import { ckERC20LedgerDashboardLink } from "constants/ckERC20";
import { Token } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

import { LinkButton } from "./LinkButton";

export interface LinkButtonsProps {
  ckToken: Token | undefined;
  contract?: string | undefined;
}

export function LinkButtons({ ckToken, contract }: LinkButtonsProps) {
  const { t } = useTranslation();

  return (
    <Flex gap="8px" wrap="wrap">
      {ckToken ? (
        <LinkButton
          link={ckERC20LedgerDashboardLink(ckToken.address)}
          label={t("token.canister", { symbol: ckToken.symbol })}
        />
      ) : null}

      {ckToken && getIcDashboard(ckToken.address) ? (
        <LinkButton link={getIcDashboard(ckToken.address)} label={t("token.dashboard", { symbol: ckToken.symbol })} />
      ) : null}

      {contract && ckToken ? (
        <LinkButton
          link={getExplorerAddress(contract)}
          label={t("token.smart.contract", { symbol: ckToken.symbol.replace("ck", "") })}
        />
      ) : null}
    </Flex>
  );
}
