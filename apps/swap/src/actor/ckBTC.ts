import { icrc2, ckBTCMinter as _ckBTCMinter } from "@icpswap/actor";
import { type ActorIdentity } from "@icpswap/types";
import { ckBTC_MINTER_ID, ckBTC_ID } from "constants/ckBTC";

export const ckBtcMinter = (identity?: ActorIdentity) => _ckBTCMinter(ckBTC_MINTER_ID, identity);

export const ckBTCActor = async (identity?: ActorIdentity) => await icrc2(ckBTC_ID, identity);
