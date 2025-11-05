import { createAction } from "@reduxjs/toolkit";

export const updateShowGetCode = createAction<boolean>("PriceAlerts/updateShowGetCode");

export const updateEmailSecond = createAction<number>("PriceAlerts/updateEmailSecond");
