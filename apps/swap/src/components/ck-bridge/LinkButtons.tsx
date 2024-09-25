import { Trans } from "@lingui/macro";
import { getExplorerAddress, getIcDashboard } from "constants/web3";
import { ckERC20LedgerDashboardLink } from "constants/ckERC20";
import { Token } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";

import { LinkButton } from "./LinkButton";

export interface LinkButtonsProps {
  ckToken: Token | undefined;
  contract?: string | undefined;
}

export function LinkButtons({ ckToken, contract }: LinkButtonsProps) {
  return (
    <Flex gap="8px" wrap="wrap">
      {ckToken ? (
        <LinkButton
          link={ckERC20LedgerDashboardLink(ckToken.address)}
          label={<Trans>{ckToken.symbol} canister</Trans>}
        />
      ) : null}

      {ckToken && getIcDashboard(ckToken.address) ? (
        <LinkButton link={getIcDashboard(ckToken.address)} label={<Trans>{ckToken.symbol ?? "--"} Dashboard</Trans>} />
      ) : null}

      {contract && ckToken ? (
        <LinkButton
          link={getExplorerAddress(contract)}
          label={<Trans>{ckToken.symbol.replace("ck", "")} smart contract on the Ethereum network</Trans>}
        />
      ) : null}
    </Flex>
  );
}
