import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@icpswap/utils";
import Web3 from "web3";

export function useETHBalance(reload?: boolean) {
  const { account } = useWeb3React();
  const [balance, setBalance] = useState<BigNumber | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function call() {
      if (account) {
        setLoading(true);
        const web3 = new Web3(Web3.givenProvider);
        const balance = await web3.eth.getBalance(account);
        setBalance(new BigNumber(balance));
        setLoading(false);
      }
    }

    call();
  }, [account, reload]);

  return useMemo(() => ({ result: balance, loading }), [balance, loading]);
}
