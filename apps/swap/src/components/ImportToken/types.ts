import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export type Metadata = {
  decimals: number;
  name: string;
  symbol: string;
  logo: string;
  fee: bigint;
};

export type Verification = {
  valid: boolean;
  metadata: Metadata;
  support_icrc2: boolean;
  standard: TOKEN_STANDARD;
  canisterId: string;
};
