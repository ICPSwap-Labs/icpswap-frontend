import { useMemo, useCallback } from "react";
import { ProjectInfo } from "@icpswap/types";
import { getVotingProjects, usePaginationAllData, getPaginationAllData } from "@icpswap/hooks";

export async function getAllProjects() {
  const fetchRecords = async (offset: number, limit: number) => {
    return await getVotingProjects(offset, limit).catch((err) => {
      console.log(err);
      return undefined;
    });
  };

  return getPaginationAllData(fetchRecords, 500);
}

export function useAllProjects() {
  const fetchRecords = useCallback(async (offset: number, limit: number) => {
    return await getVotingProjects(offset, limit).catch((err) => {
      console.log(err);
      return undefined;
    });
  }, []);

  const { loading, result } = usePaginationAllData<ProjectInfo>(fetchRecords, 500);

  return useMemo(() => {
    return {
      loading,
      result,
    };
  }, [loading, result]);
}
