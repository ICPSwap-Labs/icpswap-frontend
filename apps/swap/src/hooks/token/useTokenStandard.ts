import { nonUndefinedOrNull } from "@icpswap/utils";
import { icrc1 } from "@icpswap/actor";
import { EXTAdapter, icrc1Adapter, DIP20Adapter } from "@icpswap/token-adapter";
import { TOKEN_STANDARD } from "@icpswap/types";

export async function getIcrcStandard(canisterId: string) {
  try {
    const metadata = (await icrc1Adapter.metadata({ canisterId })).data;
    if (metadata.symbol) {
      const standards = await (await icrc1(canisterId)).icrc1_supported_standards();
      const support_icrc2 = standards.find((e) => e.name === "ICRC-2");
      if (support_icrc2) return TOKEN_STANDARD.ICRC2;
      return TOKEN_STANDARD.ICRC1;
    }
  } catch (error) {
    console.error(error);
  }

  return undefined;
}

export async function getExtStandard(canisterId: string) {
  try {
    const metadata = (await EXTAdapter.metadata({ canisterId })).data;
    if (metadata.symbol) return TOKEN_STANDARD.EXT;
  } catch (error) {
    console.error(error);
  }

  return undefined;
}

export async function getDIP20Standard(canisterId: string) {
  try {
    const metadata = (await DIP20Adapter.metadata({ canisterId })).data;
    if (metadata.symbol) return TOKEN_STANDARD.DIP20;
  } catch (error) {
    console.error(error);
  }

  return undefined;
}

export interface GetTokenStandardProps {
  canisterId: string;
}

export async function getTokenStandard({ canisterId }: GetTokenStandardProps) {
  const icrc_standard = await getIcrcStandard(canisterId);
  if (nonUndefinedOrNull(icrc_standard)) return icrc_standard;

  const dip20_standard = await getDIP20Standard(canisterId);
  if (nonUndefinedOrNull(dip20_standard)) return dip20_standard;

  const ext_standard = await getExtStandard(canisterId);
  if (nonUndefinedOrNull(ext_standard)) return ext_standard;

  return undefined;
}
