import { V3SwapNFTCanisterId } from "constants/canister";
import V2Ids from "constants/swap-v2-ids.json";

export const OFFICIAL_CANISTER_IDS = [
  "e7xmv-vyaaa-aaaag-qahha-cai",
  "ewuhj-dqaaa-aaaag-qahgq-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  V2Ids.V3SwapNFTCanister.ic,
  V3SwapNFTCanisterId,
];

// for controller get canister's image
export const OLD_CANISTER_IDS = [
  "ewuhj-dqaaa-aaaag-qahgq-cai",
  "e7xmv-vyaaa-aaaag-qahha-cai",
  "ey3ct-4aaaa-aaaak-aaueq-cai",
  "wpojy-qiaaa-aaaak-acfva-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  V2Ids.V3SwapNFTCanister.ic,
  V3SwapNFTCanisterId,
];

export type SOCIAL_LINK_TYPE = {
  label: string;
  id: string;
  value: string;
};

export const SOCIAL_LINKS: SOCIAL_LINK_TYPE[] = [
  {
    label: "Website",
    id: "Website",
    value: "Website",
  },
  {
    label: "Github",
    id: "Github",
    value: "Github",
  },
  {
    label: "Discord",
    id: "Discord",
    value: "Discord",
  },
  {
    label: "Twitter",
    id: "Twitter",
    value: "Twitter",
  },
  {
    label: "Telegram",
    id: "Telegram",
    value: "Telegram",
  },
  {
    label: "Instagram",
    id: "Instagram",
    value: "Instagram",
  },
  {
    label: "Medium",
    id: "Medium",
    value: "Medium",
  },
  {
    label: "DSCVR",
    id: "Dscvr",
    value: "Dscvr",
  },
  {
    label: "Distrikt",
    id: "Distrikt",
    value: "Distrikt",
  },

  {
    label: "Other",
    id: "Other",
    value: "Other",
  },
];

export const NFTTradeFee = 0.01;

export const MAX_NFT_MINT_SUPPLY = 10000;

export enum NFT_STANDARDS {
  ICPSwap = "ICPSwap",
}
