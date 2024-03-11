import { createAction } from "@reduxjs/toolkit";
import { Allowance } from "types/nft";

export const updateAllowance = createAction<Allowance[]>("NFTTrade/updateAllowance");
