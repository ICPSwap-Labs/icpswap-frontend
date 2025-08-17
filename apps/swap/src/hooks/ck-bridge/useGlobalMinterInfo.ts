import { useIntervalChainKeyMinterInfo } from "@icpswap/hooks";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { useEffect } from "react";
import { useGlobalMinterInfoManager } from "store/global/hooks";

export function useGlobalMinterInfo() {
  const minterInfo = useIntervalChainKeyMinterInfo(MINTER_CANISTER_ID);
  const [, updateGlobalMinterInfo] = useGlobalMinterInfoManager();

  useEffect(() => {
    if (minterInfo) {
      updateGlobalMinterInfo(minterInfo);
    }
  }, [minterInfo, updateGlobalMinterInfo]);
}
