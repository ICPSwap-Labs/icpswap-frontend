import { PRICE_ALERTS_EMAIL_SECOND } from "constants/price-alerts";

export interface PriceAlertsState {
  showGetCode: boolean;
  second: number;
}

export const initialState: PriceAlertsState = {
  showGetCode: false,
  second: PRICE_ALERTS_EMAIL_SECOND,
};
