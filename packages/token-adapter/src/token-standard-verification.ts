import { icrc1, icrc2 } from "@icpswap/actor";
import { DIP20Adapter } from "./DIP20Adapter";
import { DIP20WICPAdapter } from "./DIP20WICPAdapter";
import { DIP20XTCAdapter } from "./DIP20XTCAdapter";
import { EXTAdapter } from "./EXTAdapter";
import { icrc1Adapter } from "./ICRC1";
import { icrc2Adapter } from "./ICRC2";
import { TOKEN_STANDARD, Metadata } from "./types";

export type VerificationResult = {
  valid: boolean;
  metadata: Metadata | null | undefined;
  support_icrc2: boolean;
};

const DEFAULT_RESULT: VerificationResult = { valid: false, metadata: null, support_icrc2: false };

async function runVerification(fn: () => Promise<VerificationResult>): Promise<VerificationResult> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return DEFAULT_RESULT;
  }
}

type Verifier = (canisterId: string) => Promise<VerificationResult>;

const VERIFIERS: Partial<Record<TOKEN_STANDARD, Verifier>> = {
  [TOKEN_STANDARD.DIP20]: async (canisterId) => {
    const metadata = (await DIP20Adapter.metadata({ canisterId })).data;
    const valid = Boolean(metadata?.symbol && metadata.symbol !== "WICP" && metadata.symbol !== "XTC");
    return { metadata, valid, support_icrc2: false };
  },
  [TOKEN_STANDARD.DIP20_WICP]: async (canisterId) => {
    const metadata = (await DIP20WICPAdapter.metadata({ canisterId })).data;
    return { metadata, valid: metadata?.symbol === "WICP", support_icrc2: false };
  },
  [TOKEN_STANDARD.DIP20_XTC]: async (canisterId) => {
    const metadata = (await DIP20XTCAdapter.metadata({ canisterId })).data;
    return { metadata, valid: metadata?.symbol === "XTC", support_icrc2: false };
  },
  [TOKEN_STANDARD.EXT]: async (canisterId) => {
    const metadata = (await EXTAdapter.metadata({ canisterId })).data;
    return { metadata, valid: Boolean(metadata?.symbol), support_icrc2: false };
  },
  [TOKEN_STANDARD.ICRC2]: async (canisterId) => {
    const [metadataRes, standards] = await Promise.all([
      icrc2Adapter.metadata({ canisterId }),
      icrc2(canisterId).then((a) => a.icrc1_supported_standards()),
    ]);
    const metadata = metadataRes.data;
    const valid = Boolean(metadata?.symbol && standards.some((s) => s.name.includes("ICRC-2")));
    return { metadata, valid, support_icrc2: false };
  },
  [TOKEN_STANDARD.ICRC1]: async (canisterId) => {
    const [metadataRes, standards] = await Promise.all([
      icrc1Adapter.metadata({ canisterId }),
      icrc1(canisterId).then((a) => a.icrc1_supported_standards()),
    ]);
    const metadata = metadataRes.data;
    const valid = Boolean(metadata?.symbol && standards.some((s) => s.name.includes("ICRC-1")));
    const support_icrc2 = standards.some((s) => s.name.includes("ICRC-2"));
    return { metadata, valid, support_icrc2 };
  },
};

export async function tokenStandardVerification(
  canisterId: string,
  standard: TOKEN_STANDARD,
): Promise<VerificationResult> {
  const verifier = VERIFIERS[standard];
  if (!verifier) return DEFAULT_RESULT;
  return runVerification(() => verifier(canisterId));
}
