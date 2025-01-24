import { SwapContextProvider } from "components/swap/index";

import { SwapContextWrapper } from "./SwapContextWrapper";

export default function SwapMain() {
  return (
    <SwapContextProvider>
      <SwapContextWrapper />
    </SwapContextProvider>
  );
}
