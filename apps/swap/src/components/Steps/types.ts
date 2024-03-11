import { ReactNode } from "react";
import { Override } from "@icpswap/types";

export interface StepContent {
  title: ReactNode;
  children?: { label: ReactNode; value: ReactNode }[];
  errorActions?: ReactNode[];
  skipError?: string;
  skipOk?: string;
  errorMessage?: string;
}

export type StepDetails = Override<StepContent, { step: number }>;

export interface StepDetailsProps {
  title: ReactNode;
  onClose?: () => void;
  open: boolean;
  content: StepDetails[];
  activeStep: number;
  errorStep: number | undefined;
}
