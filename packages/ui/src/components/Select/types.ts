import { ReactNode } from "react";
import type { AllTokenOfSwapTokenInfo, Override } from "@icpswap/types";

export type MenuProps = {
  label: ReactNode;
  value: any;
  selectLabel?: ReactNode;
  additional?: string;
};

export type StringifyAllTokenOfSwapTokenInfo = Override<
  AllTokenOfSwapTokenInfo,
  { ledger_id: { __principal__: string } }
>;
