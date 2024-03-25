import { useState, useMemo, useCallback } from "react";
import { UserVotePowersInfo } from "@icpswap/types";
import { usePaginationAllDataCallback } from "hooks/usePaginationAllData";
import { getUserVotingPowers } from "@icpswap/hooks";
import { valueofUser, writeFileOneSheet } from "@icpswap/utils";

export function useDownloadPowers(canisterId: string | undefined, id: string, limit?: number): [boolean, () => void] {
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(
    async (offset: number, limit: number) => {
      if (!canisterId) return undefined;
      return await getUserVotingPowers(canisterId, id, undefined, offset, limit);
    },
    [canisterId],
  );

  const fetchAllRecords = usePaginationAllDataCallback<UserVotePowersInfo>(
    fetchRecords,
    limit ?? 1000,
    (content: UserVotePowersInfo[]) => {
      const data = content.map((d) => {
        return {
          Address: valueofUser(d.address).toString(),
          Votes: String(d.availablePowers),
          usedVotes: String(d.usedPowers),
        };
      });

      writeFileOneSheet(data, `${id}_proposal_powers`, "Powers");

      setLoading(false);
    },
  );

  return useMemo(
    () => [
      loading,
      () => {
        setLoading(true);
        if (canisterId) {
          fetchAllRecords();
        }
      },
    ],
    [loading, fetchAllRecords, setLoading, canisterId],
  );
}
