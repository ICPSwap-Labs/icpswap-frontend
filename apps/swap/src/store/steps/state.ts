import { ReactNode } from "react";
import { type StepContents } from "types/step";

export interface StepDetailsProps {
  title: ReactNode;
  onClose?: () => void;
  content: StepContents[];
  activeStep: number;
  errorStep: number | undefined;
  description?: string;
}

export interface StepsState {
  steps: { [key: string]: StepDetailsProps };
  opened: string[];
  key: number;
  data: { [key: string]: any };
}

export const initialState: StepsState = {
  steps: {},
  opened: [],
  key: 0,
  data: {},
};
