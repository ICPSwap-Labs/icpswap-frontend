import {
  DIP20Adapter,
  DIP20WICPAdapter,
  DIP20XTCAdapter,
  EXTAdapter,
  icrc1Adapter,
  icrc2Adapter,
  icpAdapter,
} from "@icpswap/token-adapter";
import { icrc1, icrc2 } from "@icpswap/actor";
import { TOKEN_STANDARD } from "constants/tokens";
import { Metadata } from "types/token";
import { ICP } from "@icpswap/tokens";

export async function standardCheck(id: string, standard: TOKEN_STANDARD) {
  let valid = false;
  let metadata: undefined | Metadata | null = null;

  if (standard === TOKEN_STANDARD.DIP20) {
    try {
      metadata = (await DIP20Adapter.metadata({ canisterId: id })).data;
      if (metadata?.symbol && metadata?.symbol !== "WICP" && metadata?.symbol !== "XTC") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.ICP) {
    if (id !== ICP.address) {
      valid = false;
    } else {
      metadata = (await icpAdapter.metadata({ canisterId: id })).data;
      valid = true;
    }
  } else if (standard === TOKEN_STANDARD.DIP20_WICP) {
    try {
      metadata = (await DIP20WICPAdapter.metadata({ canisterId: id })).data;
      if (metadata?.symbol && metadata?.symbol === "WICP") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.DIP20_XTC) {
    try {
      metadata = (await DIP20XTCAdapter.metadata({ canisterId: id })).data;
      if (metadata?.symbol && metadata.symbol === "XTC") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.EXT) {
    try {
      metadata = (await EXTAdapter.metadata({ canisterId: id })).data;
      if (metadata?.symbol) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.ICRC2) {
    try {
      metadata = (await icrc2Adapter.metadata({ canisterId: id })).data;

      const standards = await (await icrc2(id)).icrc1_supported_standards();

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
      metadata = (await icrc1Adapter.metadata({ canisterId: id })).data;

      const standards = await (await icrc1(id)).icrc1_supported_standards();

      let _valid = false;

      for (let i = 0; i < standards.length; i++) {
        if (standards[i].name.includes("ICRC-1")) {
          _valid = true;
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
  };
}
