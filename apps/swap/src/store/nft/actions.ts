import { createAction } from "@reduxjs/toolkit";
import { NFT_STANDARDS } from "@icpswap/constants";

export const updateUserSelectedCanisters = createAction<string[]>("NFT/updateUserSelectedCanisters");

export const deleteUserSelectedCanisters = createAction<string>("NFT/deleteUserSelectedCanisters");

export const importNFT = createAction<{ canisterId: string; standard: NFT_STANDARDS }>("NFT/importNFT");

export const deleteNFT = createAction<{ canisterId: string }>("NFT/deleteNFT");
