import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback, useMemo, useState } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { principalToBytes32 } from "utils/ic/index";
import { useERC20MinterHelperContract } from "hooks/web3/useContract";
import { formatTokenAmount } from "@icpswap/utils";
import { ERC20Token, Token } from "@icpswap/swap-sdk";
import { calculateGasMargin } from "utils/web3/calculateGasMargin";
import { t } from "@lingui/macro";
import { ApprovalState, useApproveCallback } from "hooks/web3/useApproveCallback";
import { Null } from "@icpswap/types";
import { useUpdateErc20TX } from "store/web3/hooks";

export interface UseMintProps {
  helperContractAddress: string | undefined;
  amount: string | number | undefined;
  erc20Token: ERC20Token | Null;
}

export function useMintCallback({ helperContractAddress, amount, erc20Token }: UseMintProps) {
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const updateErc20Tx = useUpdateErc20TX();
  const helperContract = useERC20MinterHelperContract(helperContractAddress);

  const [loading, setLoading] = useState(false);

  const approveAmount = useMemo(() => {
    if (!amount || !erc20Token) return undefined;
    return formatTokenAmount(amount, erc20Token.decimals).toString();
  }, [amount, erc20Token]);

  const [approveState, approve] = useApproveCallback(approveAmount, erc20Token, helperContractAddress);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const mint_call = useCallback(
    async (erc20: ERC20Token, amount: string | number, token: Token, blockNumber: number | string) => {
      if (!helperContract || !bytes32 || !principal) return undefined;

      setLoading(true);

      if (approveState !== ApprovalState.APPROVED) {
        await approve();
      }

      try {
        const formatAmount = formatTokenAmount(amount, erc20.decimals).toString();

        const estimatedGas = await helperContract.estimateGas
          .deposit(erc20.address, formatAmount, bytes32)
          .catch(() => {
            return helperContract.estimateGas.deposit(erc20.address, formatAmount, bytes32);
          });

        const response = await helperContract.deposit(erc20.address, formatAmount, bytes32, {
          gasLimit: calculateGasMargin(estimatedGas),
        });

        if (response) {
          openTip(
            t`ck${erc20.symbol} minting in progress: Transaction submitted and pending confirmation.`,
            MessageTypes.success,
          );
        }

        if (response && response.hash) {
          updateErc20Tx(principal, token.address, {
            timestamp: String(new Date().getTime()),
            block: String(blockNumber),
            hash: response.hash,
            from: response.from,
            to: response.to,
            value: amount.toString(),
            gas: response.gasPrice?.toString(),
          });
        }

        setLoading(false);

        return response;
      } catch (error) {
        console.warn(error);
      }

      setLoading(false);

      return undefined;
    },
    [helperContract, approveState, approve, bytes32, principal, updateErc20Tx],
  );

  return useMemo(() => ({ loading, mint_call, approveState }), [loading, mint_call, approveState]);
}
