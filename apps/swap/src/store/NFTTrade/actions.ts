import { createAction } from "@reduxjs/toolkit";
import type { Allowance } from "types/nft";

export const updateAllowance = createAction<Allowance[]>("NFTTrade/updateAllowance");
