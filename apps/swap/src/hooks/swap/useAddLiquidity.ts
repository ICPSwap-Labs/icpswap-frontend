import { useCallback } from "react";
import { updateUserPositionPoolId , getPassCode, requestPassCode } from "@icpswap/hooks";
import { Position, Token } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { getActorIdentity } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "locales/services";
import { useStepCalls, newStepKey , useCloseAllSteps } from "hooks/useStepCall";
import { getAddLiquidityStepDetails } from "components/swap/AddLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import { useSwapApprove, useSwapDeposit, useSwapTransfer } from "hooks/swap/index";
import { isUseTransfer, actualAmountToPool } from "utils/token/index";
import { createPool, mint as _mint } from "hooks/swap/v3Calls";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { useUpdateUserPositionPools } from "store/hooks";
import { useHistory } from "react-router-dom";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import type { PCMMetadata } from "@icpswap/types";
import { PassCodeManagerId } from "constants/canister";
import { Principal } from "@dfinity/principal";

let SwapPoolId: undefined | string;

interface AddLiquidityCallsArgs {
  noLiquidity: boolean;
  position: Position;
  openExternalTip: OpenExternalTip;
  stepKey: string;
  pcmMetadata: PCMMetadata;
  pcmToken: Token;
  hasPassCode: boolean;
  needPayForPCM: boolean;
}

function useAddLiquidityCalls() {
  const principal = useAccountPrincipal();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

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
    }: AddLiquidityCallsArgs) => {
      const approveOrTransferPCMToken = async () => {
        return isUseTransfer(pcmToken)
          ? await transfer(
              pcmToken,
              (pcmMetadata.passcodePrice + BigInt(pcmToken.transFee)).toString(),
              PassCodeManagerId,
            )
          : await approve(pcmToken, pcmMetadata.passcodePrice.toString(), PassCodeManagerId);
      };

      const depositPCMToken = async () => {
        return await deposit(pcmToken, pcmMetadata.passcodePrice.toString(), PassCodeManagerId);
      };

      const requestPCMCode = async () => {
        const { token0, token1, fee } = position.pool;

        const { data, message } = await requestPassCode(
          Principal.fromText(token0.address),
          Principal.fromText(token1.address),
          BigInt(fee),
        );

        if (data !== "ok") {
          openErrorTip(message ?? t`Failed to request pcm code`);
        }

        return data === "ok";
      };

      const _createPool = async () => {
        const identity = await getActorIdentity();

        const { token0, token1, fee, sqrtRatioX96 } = position.pool;

        const { status, message, data } = await createPool(
          identity,
          token0.address,
          token1.address,
          fee,
          sqrtRatioX96.toString(),
        );

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

      const approveToken0 = async () => {
        if (!position || !principal) return false;
        const poolId = getPoolId();

        const amount0Desired = position.mintAmounts.amount0.toString();
        if (amount0Desired !== "0") {
          return await approve(position.pool.token0, amount0Desired, poolId);
        }
        return true;
      };

      const approveToken1 = async () => {
        if (!position || !principal) return false;
        const poolId = getPoolId();
        const amount1Desired = position.mintAmounts.amount1.toString();
        if (amount1Desired !== "0") {
          return await approve(position.pool.token1, amount1Desired, poolId);
        }
        return true;
      };

      const transferToken0 = async () => {
        if (!position || !principal) return false;
        const poolId = getPoolId();

        const amount0Desired = position.mintAmounts.amount0.toString();
        if (amount0Desired !== "0") {
          return await transfer(position.pool.token0, amount0Desired, poolId);
        }
        return true;
      };

      const transferToken1 = async () => {
        if (!position || !principal) return false;
        const poolId = getPoolId();

        const amount1Desired = position.mintAmounts.amount1.toString();
        if (amount1Desired !== "0") {
          return await transfer(position.pool.token1, amount1Desired, poolId);
        }
        return true;
      };

      const depositToken0 = async () => {
        if (!position || !principal) return false;

        const poolId = getPoolId();
        const amount0Desired = position.mintAmounts.amount0.toString();
        if (amount0Desired === "0") return true;
        return await deposit(position.pool.token0, amount0Desired, poolId, ({ message }: ExternalTipArgs) => {
          openExternalTip({ message, tipKey: stepKey });
        });
      };

      const depositToken1 = async () => {
        if (!position || !principal) return false;

        const poolId = getPoolId();
        const amount1Desired = position.mintAmounts.amount1.toString();
        if (amount1Desired === "0") return true;
        return await deposit(position.pool.token1, amount1Desired, poolId, ({ message }: ExternalTipArgs) => {
          openExternalTip({ message, tipKey: stepKey });
        });
      };

      const mint = async () => {
        if (!position || !principal) return false;

        const poolId = getPoolId();
        const identity = await getActorIdentity();
        const {token0} = position.pool;
        const {token1} = position.pool;
        const amount0Desired = actualAmountToPool(token0, position.mintAmounts.amount0.toString());
        const amount1Desired = actualAmountToPool(token1, position.mintAmounts.amount1.toString());

        const { status, message } = await _mint(poolId, identity, {
          token0: token0.address,
          token1: token1.address,
          fee: BigInt(position.pool.fee),
          tickLower: BigInt(position.tickLower),
          tickUpper: BigInt(position.tickUpper),
          amount0Desired,
          amount1Desired,
        });

        if (status === "ok") {
          openSuccessTip(t`Add Liquidity Successfully`);

          updateUserPositionPoolId(poolId, true);
          updateStoreUserPositionPool([poolId]);

          return true;
        } if (status === "err") {
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
    [principal],
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

  const handleReclaim = () => {
    history.push("/swap/reclaim");
    closeAllSteps();
  };

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
        handleReclaim,
        handleReclaimPCMBalance,
        pcmMetadata,
        pcmToken,
        hasPassCode,
        needPayForPCM,
      });

      initialStepContent(String(key), {
        content,
        title: t`Add Liquidity Details`,
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
        position,
        pcmMetadata,
        pcmToken,
        hasPassCode,
        openExternalTip,
        noLiquidity,
        stepKey: key,
        needPayForPCM,
      });
      const { call, reset, retry } = formatCall(calls, key);

      initialStepDetails(key, { needPayForPCM, position, noLiquidity, pcmMetadata, hasPassCode, pcmToken, retry });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialStepDetails],
  );
}
