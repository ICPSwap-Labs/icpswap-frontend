export interface CustomizationState {
  fontFamily: string;
  mode: string;
  locale: string;
  rtlLayout: boolean;
  hideUnavailableClaim: boolean;
}

export const initialState: CustomizationState = {
  fontFamily: `'Manrope',ui-sans-serif,system-ui,sans-serif`,
  mode: "dark",
  locale: "en",
  rtlLayout: false,
  hideUnavailableClaim: true,
};
