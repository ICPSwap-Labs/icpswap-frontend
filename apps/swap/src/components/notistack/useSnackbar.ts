import { useContext } from "react";
import SnackbarContext from "./SnackbarContext";
import type { ProviderContext } from "./types";

export default (): ProviderContext => useContext(SnackbarContext);
