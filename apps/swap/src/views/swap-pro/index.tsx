import { SwapContextProvider } from "components/swap/index";
import { SwapProContextWrapper } from "./ContextWrapper";

export default function SwapPro() {
  return (
    <SwapContextProvider>
      <SwapProContextWrapper />
    </SwapContextProvider>
  );
}
