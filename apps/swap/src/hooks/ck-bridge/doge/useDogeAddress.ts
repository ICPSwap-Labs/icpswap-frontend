import { getDogeAddress } from "@icpswap/hooks";
import { isUndefinedOrNull, isUndefinedOrNullOrEmpty, nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

const addressAtom = atomWithStorage<string | null>("icpswap_chain_key_doge_addresses", null);

type StorageAddresses = { [principal: string]: string };

export function useDogeAddress() {
  const principal = useAccountPrincipalString();
  const [addresses, setAddresses] = useAtom(addressAtom);

  const activeAddress = useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(addresses)) return undefined;

    return (JSON.parse(addresses) as StorageAddresses)[principal];
  }, [addresses, principal]);

  const { data: address } = useQuery({
    queryKey: ["dogeAddress", principal],
    queryFn: async () => {
      if (!principal) return null;
      return await getDogeAddress(principal);
    },
    enabled: isUndefinedOrNullOrEmpty(activeAddress) && nonUndefinedOrNull(principal),
  });

  useEffect(() => {
    if (isUndefinedOrNullOrEmpty(address) || isUndefinedOrNull(principal)) return;

    if (isUndefinedOrNullOrEmpty(addresses)) {
      setAddresses(JSON.stringify({ [principal]: address }));
    } else {
      const prevAddresses = JSON.parse(addresses) as StorageAddresses;

      if (prevAddresses[principal]) return;

      setAddresses(JSON.stringify({ ...prevAddresses, [principal]: address }));
    }
  }, [address, addresses, principal, setAddresses]);

  return useMemo(() => activeAddress, [activeAddress]);
}
