import { useMemo, useCallback, useEffect, useState } from "react";
import { NumberType, ResultStatus } from "@icpswap/types";
import { parseTokenAmount, formatTokenAmount } from "@icpswap/utils";
import { Token, FeeAmount } from "@icpswap/swap-sdk";
import { getPoolCanisterId } from "hooks/swap/v3Calls";
import { getSwapPosition, depositFrom, withdraw, deposit } from "@icpswap/hooks";
import { usePoolCanisterIdManager } from "store/swap/hooks";
import BigNumber from "bignumber.js";
import { PositionDetail } from "types/swap";
import type { SwapNFTTokenMetadata, TOKEN_STANDARD } from "@icpswap/types";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { isUseTransfer, isUseTransferByStandard } from "utils/token/index";
import { tokenTransfer } from "hooks/token/calls";
import { OpenExternalTip } from "types/index";
import { SubAccount } from "@dfinity/ledger-icp";

// Now the amount that user input is the final amount swap/add/increase
// Amount is the value that the subaccount balance when use transfer, 1 token fees should be added on the amount
// And if use approve, amount is the value that the pool unused balance
export function getTokenActualTransferAmount(amount: NumberType, token: Token): string {
  const typedValue = formatTokenAmount(amount, token.decimals);
  const fee = token.transFee;

  // And 1 token fees will be subtracted by token canister,
  // so user balance should be equal to or greater than typeValue + token.fee * 2 if use transfer
  // typeValue + token.fee if use approve
  return isUseTransfer(token)
    ? parseTokenAmount(typedValue.plus(fee), token.decimals).toString()
    : parseTokenAmount(typedValue, token.decimals).toString();
}

export function getTokenActualTransferRawAmount(rawAmount: NumberType, token: Token): string {
  const fee = token.transFee;

  // And 1 token fees will be subtracted by token canister,
  // so user balance should be equal to or greater than typeValue + token.fee * 2 if use transfer
  // typeValue + token.fee if use approve
  return isUseTransfer(token) ? new BigNumber(rawAmount.toString()).plus(fee).toString() : rawAmount.toString();
}

export function getTokenActualDepositAmount(amount: NumberType, token: Token): string {
  const typedValue = formatTokenAmount(amount, token.decimals);
  const fee = token.transFee;

  return isUseTransfer(token)
    ? parseTokenAmount(typedValue.plus(fee), token.decimals).toString()
    : parseTokenAmount(typedValue, token.decimals).toString();
}

export function getTokenActualDepositRawAmount(rawAmount: NumberType, token: Token): string {
  const fee = token.transFee;

  return isUseTransfer(token)
    ? new BigNumber(rawAmount.toString()).plus(fee).toString()
    : new BigNumber(rawAmount.toString()).toString();
}

export function usePoolCanisterId(
  token0CanisterId: string | undefined | null,
  token1CanisterId: string | undefined | null,
  fee: FeeAmount | undefined | null,
) {
  const key = useMemo(() => {
    return token0CanisterId && token1CanisterId && fee
      ? `${token0CanisterId}_${token1CanisterId}_${String(fee)}`
      : undefined;
  }, [token0CanisterId, token1CanisterId, fee]);

  const [id, updatePoolCanisterId] = usePoolCanisterIdManager(key);

  useEffect(() => {
    const call = async () => {
      if (token0CanisterId && token1CanisterId && fee && key && !id) {
        const _id = await getPoolCanisterId(token0CanisterId, token1CanisterId, fee);
        if (_id) {
          updatePoolCanisterId({ key, id: _id });
        }
      }
    };

    call();
  }, [id, token0CanisterId, token1CanisterId, fee, key]);

  return useMemo(() => id, [id]);
}

export async function getPositionFromNFT(metadata: SwapNFTTokenMetadata) {
  const { attributes } = metadata;

  const positionDetail: { [key: string]: string } = {
    pool: "",
    token0: "",
    token1: "",
    fee: "",
    tickLower: "",
    tickUpper: "",
    positionId: "",
  };

  attributes.forEach((ele) => {
    positionDetail[ele.k] = ele.v;
  });

  if (!positionDetail.pool) return undefined;

  const position = await getSwapPosition(positionDetail.pool, BigInt(positionDetail.positionId));

  return {
    ...positionDetail,
    ...position,
  } as PositionDetail;
}

export function usePositionFromNFT(metadata: SwapNFTTokenMetadata) {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<PositionDetail | undefined>(undefined);

  useEffect(() => {
    const call = async () => {
      setLoading(true);
      const position = await getPositionFromNFT(metadata);
      setPosition(position);
      setLoading(false);
    };

    call();
  }, [metadata]);

  return useMemo(
    () => ({
      loading,
      result: position,
    }),
    [position, loading],
  );
}

export function usePositionsFromNFTs(data: SwapNFTTokenMetadata[] | undefined) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<PositionDetail[]>([]);

  useEffect(() => {
    const call = () => {
      if (!data) return;
      if (data.length === 0) {
        setPositions([]);
        return;
      }

      setLoading(true);

      Promise.all<PositionDetail | undefined>(
        data.map(async (ele) => {
          return await getPositionFromNFT(ele);
        }),
      ).then((result) => {
        const positions = result.filter((ele) => ele !== undefined) as PositionDetail[];
        setPositions(positions);
        setLoading(false);
      });
    };

    call();
  }, [data]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
}

export interface UseSwapDepositArgs {
  token: Token;
  amount: string;
  poolId: string;
  openExternalTip?: OpenExternalTip;
  standard: TOKEN_STANDARD;
}

export function useSwapDeposit() {
  const [openErrorTip] = useErrorTip();

  return useCallback(async ({ token, amount, poolId, openExternalTip, standard }: UseSwapDepositArgs) => {
    const useTransfer = isUseTransferByStandard(standard);

    let status: ResultStatus = ResultStatus.ERROR;
    let message = "";

    if (useTransfer) {
      const { status: _status, message: _message } = await deposit(
        poolId,
        token.address,
        BigInt(amount),
        BigInt(token.transFee),
      );
      status = _status;
      message = _message;
    } else {
      const { status: _status, message: _message } = await depositFrom(
        poolId,
        token.address,
        BigInt(amount),
        BigInt(token.transFee),
      );
      status = _status;
      message = _message;
    }

    if (status === "err") {
      if (openExternalTip) {
        openExternalTip({ message });
      } else {
        openErrorTip(
          `Failed to deposit ${token.symbol}: ${message}. Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
        );
      }

      return false;
    }

    return true;
  }, []);
}

export function useSwapTransfer() {
  const [openErrorTip] = useErrorTip();

  const principal = useAccountPrincipal();

  return useCallback(
    async (token: Token, amount: string, poolId: string, options?: TIP_OPTIONS) => {
      if (!principal) {
        openErrorTip(t`Failed to transfer: no principal`);
        return false;
      }

      const { status, message } = await tokenTransfer({
        to: poolId,
        canisterId: token.address,
        amount: new BigNumber(amount),
        from: principal?.toString() ?? "",
        subaccount: [...SubAccount.fromPrincipal(principal).toUint8Array()],
        fee: token.transFee,
        decimals: token.decimals,
      });

      if (status === "err") {
        openErrorTip(`Failed to transfer ${token.symbol}: ${message}`, options);
        return false;
      }

      return true;
    },
    [principal],
  );
}

export function useSwapWithdraw() {
  const [openErrorTip] = useErrorTip();

  return useCallback(async (token: Token, poolId: string, amount: string, openExternalTip?: OpenExternalTip) => {
    const { status, message } = await withdraw(poolId, token.address, BigInt(token.transFee), BigInt(amount));

    if (status === "err") {
      if (openExternalTip) {
        openExternalTip({ message });
      } else {
        openErrorTip(
          `Failed to withdraw ${token.symbol}: ${message}. Please click 'Reclaim Your Tokens' to reclaim your tokens.`,
        );
      }

      return false;
    }

    return true;
  }, []);
}

export * from "./useReclaimCallback";
export * from "./useSwapApprove";
export * from "./usePositionValue";
export * from "./useWithdrawPCMBalance";
export * from "./useSortedPositions";
export * from "./useTokenInsufficient";
export * from "./useSwapPositions";
export * from "./usePCMBalances";
export * from "./useSwapTokenFeeCost";
export * from "./useLiquidityLocksImage";
export * from "./useMaxAmountSpend";
