import { useMemo } from "react";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";

interface UseContactFilterProps {
  search: string | undefined;
  addresses: AddressBookType[] | undefined;
}

export function useContactFilter({ search, addresses }: UseContactFilterProps) {
  return useMemo(() => {
    if (isUndefinedOrNull(addresses)) return [];
    if (search === "" || isUndefinedOrNull(search)) return addresses;

    return addresses.filter((address) => {
      return (
        address.name.toLowerCase().includes(search.toLowerCase()) ||
        address.address.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [addresses, search]);
}
