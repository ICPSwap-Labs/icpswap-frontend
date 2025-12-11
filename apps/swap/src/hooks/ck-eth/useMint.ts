import { useAccountPrincipalString } from "store/auth/hooks";
import { useMemo, useState, useCallback } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { principalToBytes32 } from "utils/ic/index";
import { useEthMinterHelperContract, useBlockNumber } from "hooks/web3/index";
import { toHexString } from "utils/web3/index";
import { useUpdateEthMintTx } from "store/web3/hooks";
import { Null } from "@icpswap/types";
import { bytesStringOfNullSubAccount } from "constants/ckETH";
import { useTranslation } from "react-i18next";
import { ckETH } from "@icpswap/tokens";
import { useEthersWeb3Provider } from "hooks/web3/useEthersProvider";

export interface MinterProps {
  minter_address: string | Null;
}

export function useMintCallback({ minter_address }: MinterProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const provider = useEthersWeb3Provider();
  const blockNumber = useBlockNumber();
  const [openTip] = useTips();

  const [loading, setLoading] = useState(false);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const subaccount = useMemo(() => {
    return bytesStringOfNullSubAccount;
  }, []);

  const ethHelpMinter = useEthMinterHelperContract(minter_address);

  const updateUserTx = useUpdateEthMintTx();

  const mint_call = useCallback(
    async (amount: string) => {
      if (!ethHelpMinter || !principal || !provider || !bytes32 || !blockNumber) return;

      setLoading(true);

      const tx = {
        to: ethHelpMinter.address,
        data: ethHelpMinter.interface.encodeFunctionData("depositEth", [bytes32, subaccount]),
        value: toHexString(amount),
      };

      const result = await provider
        .getSigner()
        .sendTransaction(tx)
        .catch((err) => {
          console.error(err);
          openTip("Transaction for minting ckETH failed to submit", MessageTypes.error);
        });

      if (result) {
        openTip(t("ck.mint.submitted", { symbol: "ETH" }), MessageTypes.success);

        updateUserTx(principal, {
          timestamp: String(new Date().getTime()),
          block: String(blockNumber),
          hash: result.hash,
          from: result.from,
          to: result.to,
          value: result.value.toString(),
          gas: result.gasPrice?.toString(),
          ledger: ckETH.address,
          tokenSymbol: ckETH.symbol,
        });
      }

      setLoading(false);

      return result;
    },
    [updateUserTx, ethHelpMinter, principal, provider, bytes32, blockNumber, subaccount],
  );

  return useMemo(() => ({ loading, mint_call }), [loading, mint_call]);
}
