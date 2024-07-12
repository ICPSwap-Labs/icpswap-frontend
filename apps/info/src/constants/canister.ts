/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { actor, Actor } from "@icpswap/actor";
import { network, NETWORK, host } from "./server";

let CanisterIdsJson: { [key: string]: { [key1: string]: string } } = {};

try {
  const canister_ids = require("../canister_ids.json");
  const temp_canister_ids = require("../temp_canister_ids.json");

  CanisterIdsJson = {
    ...canister_ids,
    ...temp_canister_ids,
  };
} catch (error) {
  console.error(error);
}

const canisterIds: any = {};

Object.keys(CanisterIdsJson).forEach((key) => {
  canisterIds[key] = CanisterIdsJson[key][network];
});

export const getCanisterId = (canisterName: string): string => canisterIds[canisterName];

export const CANISTER_NAMES = {
  SWAP_POSITION_MANAGER: "SwapPositionManager",
  SwapFactory: "SwapFactory",
  SwapRouter: "SwapRouter",
  SwapRecord: "SwapRecordData",
  SwapNFT: "SwapNFT",
  WICP: network === NETWORK.IC ? "wicp" : "WICP_T",

  FILE: "FileAssets",
  NFTCanisterController: "V3NFTCanisterController",
  NFTCanister: "V3NFT",
  NFTTrade: "V3TradeCanister",
  FileCanister: "FileCanister",
  SwapStaker: "SwapStaker",
  SwapStakerController: "SwapStakerController",
  SwapStakerStorage: "SwapStakerStorage",
  SingleSmartChef: "SingleSmartChef",

  V3NFTCanister: "NFTDynamicCanister",
  V3TradeStat: "V3TradeStat",
  SwapPool: "SwapPool",
};

export const WICPCanisterId = getCanisterId(CANISTER_NAMES.WICP);
export const fileCanisterId = getCanisterId(CANISTER_NAMES.FILE);
export const swapRouterCanisterId = getCanisterId(CANISTER_NAMES.SwapRouter);
export const swapPositionManagerCanisterId = getCanisterId(CANISTER_NAMES.SWAP_POSITION_MANAGER);
export const SwapNFTCanisterId = getCanisterId(CANISTER_NAMES.SwapNFT);
export const stakingCanisterId = getCanisterId(CANISTER_NAMES.SwapStaker);

Actor.setActorCanisterIds(canisterIds);
actor.setHost(host.host);

export { canisterIds };
