import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type store from "./index";
import type { AppState } from "./index";

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export * from "./swap/cache/hooks";
export * from "./swap/hooks";
