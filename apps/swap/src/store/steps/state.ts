import { ReactNode } from "react";
import { type StepDetails as Details } from "components/Steps/types";

export interface StepDetailsProps {
  title: ReactNode;
  onClose?: () => void;
  content: Details[];
  activeStep: number;
  errorStep: number | undefined;
}

export interface StepDetails {
  title: ReactNode;
  onClose?: () => void;
  content: Details[];
}

export interface StepsState {
  steps: { [key: string]: StepDetailsProps };
  opened: string[];
  key: number;
}

export const initialState: StepsState = {
  steps: {},
  opened: [],
  key: 0,
};
