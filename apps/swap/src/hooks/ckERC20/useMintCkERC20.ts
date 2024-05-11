import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback, useMemo } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { principalToBytes32 } from "utils/ic/index";
import { useERC20MinterHelperContract } from "hooks/web3/useContract";
import { formatTokenAmount } from "@icpswap/utils";
import { ERC20Token } from "@icpswap/swap-sdk";
import { HELPER_SMART_CONTRACT } from "constants/ckERC20";
import { calculateGasMargin } from "utils/web3/calculateGasMargin";

export function useMintCkERC20Callback() {
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const helperContract = useERC20MinterHelperContract(HELPER_SMART_CONTRACT);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  return useCallback(
    async (erc20: ERC20Token, amount: string | number) => {
      if (!helperContract || !bytes32) return undefined;

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
          openTip("ckETH minting in progress: Transaction submitted and pending confirmation.", MessageTypes.success);
        }

        return response;
      } catch (error) {
        console.warn(error);
      }

      return undefined;
    },
    [helperContract, bytes32],
  );
}
