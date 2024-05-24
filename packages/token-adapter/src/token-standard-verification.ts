import { icrc1, icrc2 } from "@icpswap/actor";
import { DIP20Adapter } from "./DIP20Adapter";
import { DIP20WICPAdapter } from "./DIP20WICPAdapter";
import { DIP20XTCAdapter } from "./DIP20XTCAdapter";
import { EXTAdapter } from "./EXTAdapter";
import { icrc1Adapter } from "./ICRC1";
import { icrc2Adapter } from "./ICRC2";
import { TOKEN_STANDARD, Metadata } from "./types";

export async function tokenStandardVerification(canisterId: string, standard: TOKEN_STANDARD) {
  let valid = false;
  let metadata: undefined | Metadata | null = null;
  let support_icrc2 = false;

  if (standard === TOKEN_STANDARD.DIP20) {
    try {
      metadata = (await DIP20Adapter.metadata({ canisterId })).data;
      if (metadata?.symbol && metadata?.symbol !== "WICP" && metadata?.symbol !== "XTC") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.DIP20_WICP) {
    try {
      metadata = (await DIP20WICPAdapter.metadata({ canisterId })).data;
      if (metadata?.symbol && metadata?.symbol === "WICP") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.DIP20_XTC) {
    try {
      metadata = (await DIP20XTCAdapter.metadata({ canisterId })).data;

      if (metadata?.symbol && metadata.symbol === "XTC") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.EXT) {
    try {
      metadata = (await EXTAdapter.metadata({ canisterId })).data;
      if (metadata?.symbol) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.ICRC2) {
    try {
      metadata = (await icrc2Adapter.metadata({ canisterId })).data;

      const standards = await (await icrc2(canisterId)).icrc1_supported_standards();

      let _valid = false;

      for (let i = 0; i < standards.length; i++) {
        if (standards[i].name.includes("ICRC-2")) {
          _valid = true;
          break;
        }
      }

      if (metadata?.symbol && _valid) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.ICRC1) {
    try {
      metadata = (await icrc1Adapter.metadata({ canisterId })).data;
      const standards = await (await icrc1(canisterId)).icrc1_supported_standards();

      let _valid = false;

      for (let i = 0; i < standards.length; i++) {
        if (standards[i].name.includes("ICRC-1")) {
          _valid = true;
          break;
        }
      }

      for (let i = 0; i < standards.length; i++) {
        if (standards[i].name.includes("ICRC-2")) {
          support_icrc2 = true;
          break;
        }
      }

      if (metadata?.symbol && !!_valid) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  }

  return {
    valid,
    metadata,
    support_icrc2,
  };
}
