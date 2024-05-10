import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback, useMemo } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { principalToBytes32 } from "utils/ic/index";
import { useERC20MinterHelperContract } from "hooks/web3/useContract";
import { formatTokenAmount } from "@icpswap/utils";
import { ERC20Token } from "@icpswap/swap-sdk";
import { CK_ERC20_HELPER_SMART_CONTRACT } from "constants/ckERC20";
import { calculateGasMargin } from "utils/web3/calculateGasMargin";

export function useMintCkERC20Callback() {
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const erc20MinterHelper = useERC20MinterHelperContract(CK_ERC20_HELPER_SMART_CONTRACT);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  return useCallback(
    async (erc20: ERC20Token, amount: string | number) => {
      if (!erc20MinterHelper || !bytes32) return undefined;
      const formatAmount = formatTokenAmount(amount, erc20.decimals).toString();

      const estimatedGas = await erc20MinterHelper.estimateGas
        .deposit(erc20.address, formatAmount, bytes32)
        .catch(() => {
          return erc20MinterHelper.estimateGas.deposit(erc20.address, formatAmount, bytes32);
        });

      const response = await erc20MinterHelper.deposit(erc20.address, formatAmount, bytes32, {
        gasLimit: calculateGasMargin(estimatedGas),
      });

      console.log("minter helper response:", response);

      if (response) {
        openTip("ckETH minting in progress: Transaction submitted and pending confirmation.", MessageTypes.success);

        // updateUserTx(principal, {
        //   timestamp: String(new Date().getTime()),
        //   block: String(blockNumber),
        //   hash: result.hash,
        //   from: result.from,
        //   to: result.to,
        //   value: result.value.toString(),
        //   gas: result.gasPrice?.toString(),
        // });
      }

      return response;
    },
    [erc20MinterHelper, bytes32],
  );
}
