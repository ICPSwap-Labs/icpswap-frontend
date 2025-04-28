import { useCallback, useMemo, useState } from "react";
import { CircularProgress } from "components/Mui";
import type { UserSwapPoolsBalance } from "@icpswap/types";
import { Flex, TextButton } from "@icpswap/ui";
import { Pool, Token } from "@icpswap/swap-sdk";
import { useReclaim } from "hooks/swap/useReclaim";
import { useTranslation } from "react-i18next";

export interface WithdrawButtonProps {
  token: Token | undefined;
  pool: Pool | null | undefined;
  balances: UserSwapPoolsBalance[];
  onReclaimSuccess: () => void;
  fontSize?: string;
}

export function WithdrawButton({ token, pool, balances, onReclaimSuccess, fontSize }: WithdrawButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const __balances = useMemo(() => {
    if (!token || balances.length === 0) return [];

    return balances
      .reduce(
        (prev, curr) => {
          return prev.concat([
            curr.token0.address === token.address ? [curr.balance0, curr.type] : [curr.balance1, curr.type],
          ]);
        },
        [] as Array<[bigint, "unDeposit" | "unUsed"]>,
      )
      .filter(([balance]) => balance > token.transFee);
  }, [token, balances]);

  const reclaim = useReclaim();

  const handleWithdraw = useCallback(async () => {
    if (!token || loading || !pool || __balances.length === 0) return;

    setLoading(true);

    await Promise.all(
      __balances.map(async ([balance, type]) => {
        return await reclaim({ token, poolId: pool.id, type, balance, refresh: () => onReclaimSuccess() });
      }),
    );

    setLoading(false);
  }, [__balances, loading, token, pool]);

  const disabled = useMemo(() => {
    if (!__balances || __balances.length === 0 || !token) return true;
    return false;
  }, [__balances, token]);

  return (
    <Flex gap="0 8px">
      <TextButton onClick={handleWithdraw} sx={{ fontSize }} disabled={disabled}>
        {t("common.withdraw")}
      </TextButton>
      {loading ? <CircularProgress size={fontSize === "14px" ? 14 : 12} sx={{ color: "#ffffff" }} /> : null}
    </Flex>
  );
}
