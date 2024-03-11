import { actor } from "../actor";
import { ExchangeRate, ExchangeRateInterfaceFactory } from "@icpswap/candid";

export const exchangeRate = () =>
  actor.create<ExchangeRate>({
    canisterId: "2ixw4-taaaa-aaaag-qcpdq-cai",
    idlFactory: ExchangeRateInterfaceFactory,
  });
