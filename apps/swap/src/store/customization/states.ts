export interface CustomizationState {
  fontFamily: string;
  mode: string;
  locale: string;
  rtlLayout: boolean;
  hideUnavailableClaim: boolean;
}

export const initialState: CustomizationState = {
  fontFamily: `'Poppins','Roboto',sans-serif`,
  mode: "dark",
  locale: "en",
  rtlLayout: false,
  hideUnavailableClaim: true,
};
