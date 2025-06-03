import { Null } from "@icpswap/types";
import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";
import { stringifyBackPath } from "utils/index";

export interface UserLiquidityEmptyProps {
  token0Address?: string | Null;
  token1Address?: string | Null;
  backPath?: string;
}

export function UserLiquidityEmpty({ backPath, token0Address, token1Address }: UserLiquidityEmptyProps) {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: (
              <TextButton
                to={
                  token0Address && token1Address
                    ? `/liquidity/add/${token0Address}/${token1Address}?path=${stringifyBackPath(backPath)}`
                    : `/liquidity/add?path=${stringifyBackPath(backPath)}`
                }
              >
                <Trans>Add liquidity</Trans>
              </TextButton>
            ),
          }}
          i18nKey="liquidity.transactions.empty"
        />
      }
    />
  );
}
