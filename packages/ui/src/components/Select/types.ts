import { ReactNode } from "react";
import type { IcpSwapAPITokenInfo, Override } from "@icpswap/types";

export type MenuProps = {
  label: ReactNode;
  value: any;
  selectLabel?: ReactNode;
  additional?: string;
};

export type StringifyAllTokenOfSwapTokenInfo = Override<IcpSwapAPITokenInfo, { ledger_id: { __principal__: string } }>;
