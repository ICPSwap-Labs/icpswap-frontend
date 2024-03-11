import { createAction } from "@reduxjs/toolkit";
import { StepDetailsProps } from "./state";

export const updateStepDetails = createAction<{ key: string; value: StepDetailsProps }>("steps/updateStepDetails");

export const open = createAction<string | undefined>("steps/open");

export const close = createAction<string | undefined>("steps/close");

export const updateKey = createAction<void>("steps/updateKey");

export const closeAll = createAction<void>("steps/closeAll");
