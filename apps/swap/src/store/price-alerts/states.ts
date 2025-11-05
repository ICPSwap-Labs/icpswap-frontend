import { PRICE_ALERTS_EMAIL_SECOND } from "constants/swap";

export interface PriceAlertsState {
  showGetCode: boolean;
  second: number;
}

export const initialState: PriceAlertsState = {
  showGetCode: false,
  second: PRICE_ALERTS_EMAIL_SECOND,
};
