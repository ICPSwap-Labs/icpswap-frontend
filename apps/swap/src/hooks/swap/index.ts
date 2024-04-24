import { useMemo, useCallback, useEffect, useState } from "react";
import { NumberType, ResultStatus } from "@icpswap/types";
import { parseTokenAmount, formatTokenAmount } from "@icpswap/utils";
import { Token, FeeAmount } from "@icpswap/swap-sdk";
import { getPoolCanisterId } from "hooks/swap/v3Calls";
import { getSwapPosition, depositFrom, withdraw, deposit } from "@icpswap/hooks";
import { usePoolCanisterIdManager } from "store/swap/hooks";
import BigNumber from "bignumber.js";
import { PositionDetail } from "types/swap";
import type { SwapNFTTokenMetadata } from "@icpswap/types";
import { getActorIdentity } from "components/Identity";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { isUseTransfer } from "utils/token/index";
import { tokenTransfer } from "hooks/token/calls";
import { OpenExternalTip } from "types/index";
import { SubAccount } from "@dfinity/ledger-icp";

export function useActualSwapAmount(amount: NumberType | undefined, currency: Token | undefined): string | undefined {
  return useMemo(() => {
    if (!amount || !currency) return undefined;

    const typedValue = formatTokenAmount(amount, currency.decimals);
    const fee = currency.transFee;

    if (typedValue.isGreaterThan(currency.transFee)) {
      // When token use transfer, 1 trans fee will be subtracted by endpoint
      return isUseTransfer(currency.wrapped)
        ? parseTokenAmount(typedValue.minus(fee), currency.decimals).toString()
        : parseTokenAmount(typedValue, currency.decimals).toString();
    }

    return "0";
  }, [amount, currency]);
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

export function useSwapDeposit() {
  const [openErrorTip] = useErrorTip();

  return useCallback(async (token: Token, amount: string, poolId: string, openExternalTip?: OpenExternalTip) => {
    const identity = await getActorIdentity();

    const useTransfer = isUseTransfer(token);

    let status: ResultStatus = ResultStatus.ERROR;
    let message = "";

    if (useTransfer) {
      const { status: _status, message: _message } = await deposit(
        identity,
        poolId,
        token.address,
        BigInt(amount),
        BigInt(token.transFee),
      );
      status = _status;
      message = _message;
    } else {
      const { status: _status, message: _message } = await depositFrom(
        identity,
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
          `Failed to deposit ${token.symbol}: ${message}. Please click 'Reclaim Your Tokens' to reclaim your tokens.`,
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
    const identity = await getActorIdentity();

    const { status, message } = await withdraw(identity, poolId, token.address, BigInt(token.transFee), BigInt(amount));

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
