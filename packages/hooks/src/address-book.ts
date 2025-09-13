import { useCallback } from "react";
import { addressBook } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { AddressBook, ResultStatus } from "@icpswap/types";

import { useCallsData } from "./useCallData";

export async function getAddressBook() {
  return resultFormat<Array<AddressBook>>(await (await addressBook(true)).get()).data;
}

export function useAddressBook(refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      return await getAddressBook();
    }, []),
    refresh,
  );
}

export async function addAddressBook(name: string, address: string) {
  await (await addressBook(true)).create({ IC: null }, name, address);

  return {
    status: ResultStatus.OK,
    message: "",
    data: undefined,
  };
}

export async function deleteAddressBook(id: bigint) {
  await (await addressBook(true)).remove(id);

  return {
    status: ResultStatus.OK,
    message: "",
    data: undefined,
  };
}

export async function editAddressBook(id: bigint, name: string, address: string) {
  await (await addressBook(true)).update(id, { IC: null }, name, address);

  return {
    status: ResultStatus.OK,
    message: "",
    data: undefined,
  };
}
