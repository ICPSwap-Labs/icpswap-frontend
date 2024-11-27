import { useCallback, useEffect, useMemo } from "react";
import { useCallsData } from "@icpswap/hooks";
import { useAppDispatch } from "store/hooks";

const ROSETTA_API__BASE = "https://rosetta-api.internetcomputer.org";
const INTERNET_COMPUTER_BASE = "https://ic-api.internetcomputer.org/api/v3";

export function useICPBlocksCall() {
  return useCallsData(
    useCallback(async () => {
      const fetch_result = await fetch(`${INTERNET_COMPUTER_BASE}/metrics/block-rate`).catch(() => undefined);

      if (!fetch_result) return undefined;

      const result = (await fetch_result.json()) as {
        block_rate: [number, number][];
      };

      return {
        blocks: result.block_rate[0][0],
        secondBlocks: result.block_rate[0][1],
      };
    }, []),
  );
}

export function useICPBlocksManager() {
  // const dispatch = useAppDispatch();
  const { result } = useICPBlocksCall();
  const { blocks, secondBlocks } = result ?? {};

  // useEffect(() => {
  //   dispatch(updateICPBlocks({ blocks: blocks ?? "", secondBlocks: secondBlocks ?? "" }));
  // }, [dispatch, blocks, secondBlocks]);

  return useMemo(
    () => ({
      blocks,
      secondBlocks,
    }),
    [blocks, secondBlocks],
  );
}
