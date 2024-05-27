import { actor, Actor } from "@icpswap/actor";
import { network, NETWORK, host } from "./server";

let CanisterIdsJson: { [key: string]: { [key1: string]: string } } = {};

try {
  const context = require.context("../canister-ids", true, /\.json$/);

  context.keys().forEach((key: string) => {
    let canister_ids = context(key);

    if (key.includes("icpswap-v2")) {
      canister_ids = {};
      Object.keys(context(key)).forEach((canisterName) => {
        canister_ids[`V2${canisterName}`] = context(key)[canisterName];
      });
    }

    if (
      (key.includes(network) && network !== NETWORK.IC) ||
      (network === NETWORK.IC && key.includes("canister_ids.json"))
    ) {
      CanisterIdsJson = {
        ...CanisterIdsJson,
        ...canister_ids,
        ...(key.includes("voting") && !!canister_ids.FileCanister
          ? { VotingFileCanister: canister_ids.FileCanister }
          : {}),
      };
    }
  });
} catch (error) {
  console.error(error);
}

// Test canister ids
function dynamicGetTestCanisters() {
  const context = require.context("../../src", false, /canister_ids.json$/);

  context.keys().forEach((key: string) => {
    if (key.includes("temp_canister_ids")) {
      const canister_ids = context(key);

      CanisterIdsJson = {
        ...CanisterIdsJson,
        ...canister_ids,
      };
    }
  });
}

dynamicGetTestCanisters();

const canisterIds: { [key: string]: string } = {};
Object.keys(CanisterIdsJson).forEach((canister) => {
  canisterIds[canister] = CanisterIdsJson[canister][network];
});

export const getCanisterId = (canisterName: string): string => {
  return canisterIds[canisterName];
};

export const CANISTER_NAMES = {
  TOKEN_CANISTER_CONTROLLER: "TokenCanisterController",
  TOKEN_SERVICE: "token",
  SWAP_POSITION_MANAGER: "SwapPositionManager",
  WICP: network === NETWORK.IC ? "wicp" : "WICP_T",
  FILE: "FileAssets",
  NFTCanisterController: "V3NFTCanisterController",
  SwapNFTCanister: "V3SwapNFTCanister",
  V3NFTCanister: "NFTDynamicCanister",
  V3TradeStat: "V3TradeStat",
  NFTTrade: "V3TradeCanister",
  FileCanister: "FileCanister",
  V1StakingController: "SwapStakerController",
  SingleSmartChef: "SingleSmartChef",
  SwapStaker: "SwapStaker",
  VOTE: "Vote",
  FileActor: "File",
  SwapRecord: "BaseDataStructure",
  SwapGraphPool: "Pools",
  TokenList: "TokenList",

  V3SwapFactory: "SwapFactory",
  V3SwapPool: "SwapPool",
  V3SwapNFT: "SwapNFT",
  PassCodeManager: "PassCodeManager",

  ClaimStorage: "ClaimStorage",

  VotingFileCanister: "VotingFileCanister",
  FarmController: "FarmController",
  StakingTokenController: "StakingTokenController",

  NodeIndex: "node_index",
  GlobalIndex: "global_index",
};

export const fileCanisterId = getCanisterId(CANISTER_NAMES.FILE);
export const WICPCanisterId = getCanisterId(CANISTER_NAMES.WICP);
export const swapPositionManagerCanisterId = getCanisterId(CANISTER_NAMES.SWAP_POSITION_MANAGER);
export const SwapNFTCanisterId = getCanisterId(CANISTER_NAMES.SwapNFTCanister);
export const NFTCanisterController = getCanisterId(CANISTER_NAMES.NFTCanisterController);
export const FileCanisterId = getCanisterId(CANISTER_NAMES.FileActor);
export const ClaimStorageId = getCanisterId(CANISTER_NAMES.ClaimStorage);
export const NFTTradeTokenCanisterId = WICPCanisterId;
export const V3SwapNFTCanisterId = getCanisterId(CANISTER_NAMES.V3SwapNFT);
export const VotingFileCanisterId = getCanisterId(CANISTER_NAMES.VotingFileCanister);
export const FarmControllerId = getCanisterId(CANISTER_NAMES.FarmController);
export const NodeIndexId = getCanisterId(CANISTER_NAMES.NodeIndex);
export const GlobalId = getCanisterId(CANISTER_NAMES.GlobalIndex);
export const PassCodeManagerId = getCanisterId(CANISTER_NAMES.PassCodeManager);

Actor.setActorCanisterIds(canisterIds);
actor.setHost(host);

export const ALL_CANISTER_IDS = [...Object.values(canisterIds)];

export { canisterIds };
