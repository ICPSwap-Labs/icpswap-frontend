import { ReactNode } from "react";
import { Override } from "@icpswap/types";

export type ExternalTipArgs = { message: string | undefined; tipKey?: string; poolId?: string; tokenId?: string };
export type OpenExternalTip = (args: ExternalTipArgs) => void;

export interface StepContent {
  title: ReactNode;
  children?: { label: ReactNode; value: ReactNode }[];
  errorActions?: ReactNode[];
  skipError?: string;
  skipOk?: string;
  errorMessage?: string;
}

export type StepContents = Override<StepContent, { step: number }>;

export interface StepDetailsProps {
  title: ReactNode;
  onClose?: () => void;
  open: boolean;
  content: StepContents[];
  activeStep: number;
  errorStep: number | undefined;
  description?: string;
}

export interface StepDetails {
  title: ReactNode;
  onClose?: () => void;
  content: StepContents[];
  description?: string;
}
