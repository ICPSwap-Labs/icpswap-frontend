import { ToolService, ToolInterfaceFactory } from "@icpswap/candid";
import { actor } from "../actor";

export const userTokenHelper = () =>
  actor.create<ToolService>({
    canisterId: "mecty-aaaaa-aaaag-qkp6a-cai",
    idlFactory: ToolInterfaceFactory,
  });
