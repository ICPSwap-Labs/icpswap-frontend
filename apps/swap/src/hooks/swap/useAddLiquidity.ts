import { useCallback } from "react";
import { updateUserPositionPoolId, getPassCode, requestPassCode } from "@icpswap/hooks";
import { Position, Token } from "@icpswap/swap-sdk";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey, useCloseAllSteps } from "hooks/useStepCall";
import { getAddLiquidityStepDetails } from "components/swap/AddLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import {
  useSwapApprove,
  useSwapDeposit,
  useSwapTransfer,
  getTokenInsufficient,
  noApproveByTokenInsufficient,
  getTokenActualTransferRawAmount,
  getTokenActualDepositRawAmount,
  noTransferByTokenInsufficient,
  noDepositByTokenInsufficient,
} from "hooks/swap/index";
import { isUseTransfer } from "utils/token/index";
import { createPool, mint as __mint } from "hooks/swap/v3Calls";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { useUpdateUserPositionPools } from "store/hooks";
import { useHistory } from "react-router-dom";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import type { Null, PCMMetadata, TOKEN_STANDARD } from "@icpswap/types";
import { PassCodeManagerId } from "constants/canister";
import { Principal } from "@dfinity/principal";
import { BigNumber } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { useStepsToReclaimCallback } from "./useStepsToReclaimCallback";

let SwapPoolId: undefined | string;

interface AddLiquidityCallsArgs {
  principal: string;
  noLiquidity: boolean;
  position: Position;
  openExternalTip: OpenExternalTip;
  stepKey: string;
  pcmMetadata: PCMMetadata;
  pcmToken: Token;
  hasPassCode: boolean;
  needPayForPCM: boolean;
  token0Balance: string;
  token1Balance: string;
  token0SubAccountBalance: string;
  token1SubAccountBalance: string;
  unusedBalance: {
    balance0: bigint;
    balance1: bigint;
  };
  subnet?: string | Null;
}

function useAddLiquidityCalls() {
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const { t } = useTranslation();

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();

  const updateStoreUserPositionPool = useUpdateUserPositionPools();

  return useCallback(
    ({
      noLiquidity,
      position,
      pcmMetadata,
      pcmToken,
      hasPassCode,
      openExternalTip,
      stepKey,
      needPayForPCM,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
      subnet,
    }: AddLiquidityCallsArgs) => {
      const approveOrTransferPCMToken = async () => {
        return isUseTransfer(pcmToken)
          ? await transfer(
              pcmToken,
              (pcmMetadata.passcodePrice + BigInt(pcmToken.transFee)).toString(),
              PassCodeManagerId,
            )
          : await approve({ token: pcmToken, amount: pcmMetadata.passcodePrice.toString(), poolId: PassCodeManagerId });
      };

      const depositPCMToken = async () => {
        return await deposit({
          token: pcmToken,
          amount: pcmMetadata.passcodePrice.toString(),
          poolId: PassCodeManagerId,
          standard: pcmToken.standard as TOKEN_STANDARD,
        });
      };

      const requestPCMCode = async () => {
        const { token0, token1, fee } = position.pool;

        const { data, message } = await requestPassCode(
          Principal.fromText(token0.address),
          Principal.fromText(token1.address),
          BigInt(fee),
        );

        if (data !== "ok") {
          openErrorTip(message ?? `Failed to request pcm code`);
        }

        return data === "ok";
      };

      const _createPool = async () => {
        const { token0, token1, fee, sqrtRatioX96 } = position.pool;

        const { status, message, data } = await createPool({
          token0: token0.address,
          token1: token1.address,
          fee,
          sqrtPriceX96: sqrtRatioX96.toString(),
          subnet,
        });

        if (status === "err" || !data) {
          openErrorTip(message);
          return false;
        }

        SwapPoolId = data?.canisterId.toString();

        return true;
      };

      const getPoolId = () => {
        return !noLiquidity ? position.pool.id : SwapPoolId ?? position.pool.id;
      };

      const { token0, token1 } = position.pool;
      const amount0Desired = position.mintAmounts.amount0.toString();
      const amount1Desired = position.mintAmounts.amount1.toString();

      const token0Insufficient = getTokenInsufficient({
        token: token0,
        subAccountBalance: token0SubAccountBalance,
        balance: token0Balance,
        formatTokenAmount: amount0Desired,
        unusedBalance: unusedBalance.balance0,
      });

      const token1Insufficient = getTokenInsufficient({
        token: token1,
        subAccountBalance: token1SubAccountBalance,
        balance: token1Balance,
        formatTokenAmount: amount1Desired,
        unusedBalance: unusedBalance.balance1,
      });

      const approveToken0 = async () => {
        const poolId = getPoolId();
        const token0 = position.pool.token0;

        if (noApproveByTokenInsufficient(token0Insufficient)) return true;

        if (amount0Desired !== "0") {
          return await approve({
            token: token0,
            amount: amount0Desired,
            poolId,
            standard: token0.standard as TOKEN_STANDARD,
          });
        }

        return true;
      };

      const approveToken1 = async () => {
        const poolId = getPoolId();

        if (noApproveByTokenInsufficient(token1Insufficient)) return true;

        if (amount1Desired !== "0") {
          return await approve({
            token: token1,
            amount: amount1Desired,
            poolId,
            standard: token1.standard as TOKEN_STANDARD,
          });
        }

        return true;
      };

      const transferToken0 = async () => {
        const poolId = getPoolId();

        if (noTransferByTokenInsufficient(token0Insufficient)) return true;

        if (amount0Desired !== "0") {
          return await transfer(
            token0,
            getTokenActualTransferRawAmount(
              new BigNumber(amount0Desired)
                .minus(unusedBalance.balance0.toString())
                .minus(token0SubAccountBalance)
                .toString(),
              token0,
            ),
            poolId,
          );
        }

        return true;
      };

      const transferToken1 = async () => {
        const poolId = getPoolId();

        if (noTransferByTokenInsufficient(token1Insufficient)) return true;

        if (amount1Desired !== "0") {
          return await transfer(
            token1,
            getTokenActualDepositRawAmount(
              new BigNumber(amount1Desired)
                .minus(unusedBalance.balance1.toString())
                .minus(token1SubAccountBalance)
                .toString(),
              token1,
            ),
            poolId,
          );
        }

        return true;
      };

      const depositToken0 = async () => {
        const poolId = getPoolId();

        if (noDepositByTokenInsufficient(token0Insufficient)) return true;
        if (amount0Desired === "0") return true;

        // Mins 1 token fee by backend, so the deposit amount should add 1 token fee if use deposit
        return await deposit({
          token: token0,
          amount: getTokenActualDepositRawAmount(
            new BigNumber(amount0Desired).minus(unusedBalance.balance0.toString()).toString(),
            token0,
          ),
          poolId,
          openExternalTip: ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey, poolId });
          },
          standard: token0.standard as TOKEN_STANDARD,
        });
      };

      const depositToken1 = async () => {
        const poolId = getPoolId();

        if (noDepositByTokenInsufficient(token1Insufficient)) return true;
        if (amount1Desired === "0") return true;

        return await deposit({
          token: token1,
          amount: getTokenActualDepositRawAmount(
            new BigNumber(amount1Desired).minus(unusedBalance.balance1.toString()).toString(),
            token1,
          ),
          poolId,
          openExternalTip: ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey, poolId });
          },
          standard: token1.standard as TOKEN_STANDARD,
        });
      };

      const mint = async () => {
        const poolId = getPoolId();

        const { status, message } = await __mint(poolId, {
          token0: token0.address,
          token1: token1.address,
          fee: BigInt(position.pool.fee),
          tickLower: BigInt(position.tickLower),
          tickUpper: BigInt(position.tickUpper),
          amount0Desired,
          amount1Desired,
        });

        if (status === "ok") {
          openSuccessTip(t("liquidity.add.success"));

          updateUserPositionPoolId(poolId, true);
          updateStoreUserPositionPool([poolId]);

          return true;
        }
        if (status === "err") {
          openExternalTip({ message: getLocaleMessage(message), tipKey: stepKey });
          return false;
        }

        return false;
      };

      return [
        noLiquidity && !hasPassCode && needPayForPCM ? approveOrTransferPCMToken : undefined,
        noLiquidity && !hasPassCode && needPayForPCM ? depositPCMToken : undefined,
        noLiquidity && !hasPassCode ? requestPCMCode : undefined,
        noLiquidity ? _createPool : undefined,
        isUseTransfer(position?.pool.token0) ? transferToken0 : approveToken0,
        depositToken0,
        isUseTransfer(position?.pool.token1) ? transferToken1 : approveToken1,
        depositToken1,
        mint,
      ].filter((fn) => fn !== undefined) as (() => Promise<boolean>)[];
    },
    [],
  );
}

interface InitialAddLiquidityStepsArgs {
  position: Position;
  noLiquidity: boolean;
  retry: () => void;
  pcmMetadata: PCMMetadata;
  pcmToken: Token;
  hasPassCode: boolean;
  needPayForPCM: boolean;
}

function useInitialAddLiquiditySteps() {
  const initialStepContent = useStepContentManager();
  const history = useHistory();
  const closeAllSteps = useCloseAllSteps();
  const { t } = useTranslation();
  const stepsToReclaimCallback = useStepsToReclaimCallback();

  const handleReclaimPCMBalance = () => {
    history.push("/swap/pcm/reclaim");
    closeAllSteps();
  };

  return useCallback(
    (
      key: string,
      { position, noLiquidity, retry, pcmMetadata, pcmToken, hasPassCode, needPayForPCM }: InitialAddLiquidityStepsArgs,
    ) => {
      const content = getAddLiquidityStepDetails({
        position,
        noLiquidity,
        retry,
        handleReclaim: stepsToReclaimCallback,
        handleReclaimPCMBalance,
        pcmMetadata,
        pcmToken,
        hasPassCode,
        needPayForPCM,
      });

      initialStepContent(String(key), {
        content,
        title: t("swap.add.liquidity.details"),
      });
    },
    [],
  );
}

export interface AddLiquidityCallProps {
  position: Position;
  noLiquidity: boolean;
  openExternalTip: OpenExternalTip;
  pcmMetadata: PCMMetadata;
  pcmToken: Token;
  principal: string;
  needPayForPCM: boolean;
  token0Balance: string;
  token1Balance: string;
  token0SubAccountBalance: string;
  token1SubAccountBalance: string;
  unusedBalance: {
    balance0: bigint;
    balance1: bigint;
  };
  subnet?: string | Null;
}

export function useAddLiquidityCall() {
  const getCalls = useAddLiquidityCalls();
  const formatCall = useStepCalls();
  const initialStepDetails = useInitialAddLiquiditySteps();

  return useCallback(
    async ({
      position,
      noLiquidity,
      principal,
      pcmMetadata,
      pcmToken,
      openExternalTip,
      needPayForPCM,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
      subnet,
    }: AddLiquidityCallProps) => {
      let hasPassCode = false;

      if (noLiquidity) {
        const passCode = await getPassCode(principal);

        const { token0, token1, fee } = position.pool;
        hasPassCode =
          passCode.find(
            (ele) =>
              ele.token0.toString() === token0.address &&
              ele.token1.toString() === token1.address &&
              ele.fee === BigInt(fee),
          ) !== undefined;
      }

      const key = newStepKey();
      const calls = getCalls({
        principal,
        position,
        pcmMetadata,
        pcmToken,
        hasPassCode,
        openExternalTip,
        noLiquidity,
        stepKey: key,
        needPayForPCM,
        token0Balance,
        token1Balance,
        token0SubAccountBalance,
        token1SubAccountBalance,
        unusedBalance,
        subnet,
      });
      const { call, reset, retry } = formatCall(calls, key);

      initialStepDetails(key, { needPayForPCM, position, noLiquidity, pcmMetadata, hasPassCode, pcmToken, retry });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialStepDetails],
  );
}
