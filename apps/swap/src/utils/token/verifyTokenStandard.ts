import { icrc1, icrc2 } from "@icpswap/actor";
import {
  DIP20Adapter,
  DIP20WICPAdapter,
  DIP20XTCAdapter,
  EXTAdapter,
  icpAdapter,
  icrc1Adapter,
  icrc2Adapter,
} from "@icpswap/token-adapter";
import { ICP } from "@icpswap/tokens";
import { TOKEN_STANDARD } from "constants/tokens";
import type { Metadata } from "types/token";

export type VerifyTokenStandardResult = {
  valid: boolean;
  metadata: Metadata | null | undefined;
};

async function runVerification(fn: () => Promise<VerifyTokenStandardResult>): Promise<VerifyTokenStandardResult> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return { valid: false, metadata: null };
  }
}

export async function verifyTokenStandard(
  canisterId: string,
  standard: TOKEN_STANDARD,
): Promise<VerifyTokenStandardResult> {
  const defaultResult: VerifyTokenStandardResult = { valid: false, metadata: null };

  if (standard === TOKEN_STANDARD.DIP20) {
    return runVerification(async () => {
      const metadata = (await DIP20Adapter.metadata({ canisterId })).data;
      const valid = Boolean(metadata?.symbol && metadata.symbol !== "WICP" && metadata.symbol !== "XTC");
      return { metadata, valid };
    });
  }

  if (standard === TOKEN_STANDARD.ICP) {
    if (canisterId !== ICP.address) {
      return defaultResult;
    }
    return runVerification(async () => {
      const metadata = (await icpAdapter.metadata({ canisterId })).data;
      return { metadata, valid: true };
    });
  }

  if (standard === TOKEN_STANDARD.DIP20_WICP) {
    return runVerification(async () => {
      const metadata = (await DIP20WICPAdapter.metadata({ canisterId })).data;
      const valid = metadata?.symbol === "WICP";
      return { metadata, valid };
    });
  }

  if (standard === TOKEN_STANDARD.DIP20_XTC) {
    return runVerification(async () => {
      const metadata = (await DIP20XTCAdapter.metadata({ canisterId })).data;
      const valid = metadata?.symbol === "XTC";
      return { metadata, valid };
    });
  }

  if (standard === TOKEN_STANDARD.EXT) {
    return runVerification(async () => {
      const metadata = (await EXTAdapter.metadata({ canisterId })).data;
      const valid = Boolean(metadata?.symbol);
      return { metadata, valid };
    });
  }

  if (standard === TOKEN_STANDARD.ICRC2) {
    return runVerification(async () => {
      const metadata = (await icrc2Adapter.metadata({ canisterId })).data;
      const standards = await (await icrc2(canisterId)).icrc1_supported_standards();
      const valid = Boolean(metadata?.symbol && standards.some((s) => s.name.includes("ICRC-2")));
      return { metadata, valid };
    });
  }

  if (standard === TOKEN_STANDARD.ICRC1) {
    return runVerification(async () => {
      const metadata = (await icrc1Adapter.metadata({ canisterId })).data;
      const standards = await (await icrc1(canisterId)).icrc1_supported_standards();
      const valid = Boolean(metadata?.symbol && standards.some((s) => s.name.includes("ICRC-1")));
      return { metadata, valid };
    });
  }

  return defaultResult;
}
