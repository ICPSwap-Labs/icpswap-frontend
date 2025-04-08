import { useCallback } from "react";
import { Pool, CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getCollectFeeSteps } from "components/swap/CollectFeeSteps";
import { useStepContentManager } from "store/steps/hooks";
import { useReclaimCallback } from "hooks/swap/index";
import { useErrorTip } from "hooks/useTips";
import { collect } from "hooks/swap/v3Calls";
import { OpenExternalTip } from "types/index";
import { useTranslation } from "react-i18next";

export async function collectPositionFee(pool: string, positionId: bigint) {
  return await collect(pool, {
    positionId,
  });
}

interface CollectFeeCallsArgs {
  currencyFeeAmount0: CurrencyAmount<Token>;
  pool: Pool;
  positionId: bigint;
  currencyFeeAmount1: CurrencyAmount<Token>;
  openExternalTip: OpenExternalTip;
  stepKey: string;
  refresh?: () => void;
}

function useCollectFeeCalls() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const { t } = useTranslation();

  return useCallback(
    ({ pool, positionId, refresh }: CollectFeeCallsArgs) => {
      const _collect = async () => {
        if (!positionId || !principal || !pool) return false;

        const { status, message } = await collectPositionFee(pool.id, positionId);

        if (status === "ok") {
          if (refresh) refresh();
          return true;
        }

        openErrorTip(getLocaleMessage(message) ?? t`Failed to claim`);
        return false;
      };

      return [_collect];
    },
    [principal],
  );
}

interface AddLiquidityStepsArgs {
  positionId: bigint;
  retry: () => Promise<boolean>;
  currencyFeeAmount0: CurrencyAmount<Token>;
  currencyFeeAmount1: CurrencyAmount<Token>;
}

function useCollectFeeSteps() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const stepContentManage = useStepContentManager();

  const handleReclaim = useReclaimCallback();

  return useCallback(
    (key: string, { positionId, retry, currencyFeeAmount0, currencyFeeAmount1 }: AddLiquidityStepsArgs) => {
      const content = getCollectFeeSteps({
        positionId,
        retry,
        currencyFeeAmount1,
        currencyFeeAmount0,
        principal,
        handleReclaim,
      });

      stepContentManage(String(key), {
        content,
        title: t("swap.claim.fees.details"),
      });
    },
    [principal],
  );
}

export interface ClaimFeeArgs {
  currencyFeeAmount0: CurrencyAmount<Token>;
  pool: Pool;
  positionId: bigint;
  currencyFeeAmount1: CurrencyAmount<Token>;
  openExternalTip: OpenExternalTip;
  refresh?: () => void;
}

export function useCollectFeeCallback() {
  const getCalls = useCollectFeeCalls();
  const formatCall = useStepCalls();
  const initialSteps = useCollectFeeSteps();

  return useCallback(
    ({ pool, positionId, currencyFeeAmount0, currencyFeeAmount1, openExternalTip, refresh }: ClaimFeeArgs) => {
      const key = newStepKey();
      const calls = getCalls({
        pool,
        positionId,
        currencyFeeAmount0,
        currencyFeeAmount1,
        openExternalTip,
        stepKey: key,
        refresh,
      });
      const { call, reset, retry } = formatCall(calls, key);

      initialSteps(key, { positionId, currencyFeeAmount0, currencyFeeAmount1, retry });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialSteps],
  );
}
