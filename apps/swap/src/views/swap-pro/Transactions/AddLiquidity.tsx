import { Button } from "components/Mui";
import { memo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface AddLiquidityProps {
  token0: Token | Null;
  token1: Token | Null;
}

export const AddLiquidity = memo(({ token0, token1 }: AddLiquidityProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleLoadPage = () => {
    if (!token0 || !token1) return;
    history.push(
      `/liquidity/add/${token0.address}/${token1.address}/3000?path=${window.btoa(
        `/swap/pro?input=${token0.address}&output=${token1.address}`,
      )}`,
    );
  };

  return (
    <Button onClick={handleLoadPage} variant="contained" style={{ width: "fit-content" }}>
      {t("swap.add.liquidity")}
    </Button>
  );
});
