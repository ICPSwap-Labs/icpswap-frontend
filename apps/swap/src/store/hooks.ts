import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import store, { AppState } from "./index";

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export * from "./swap/hooks";
export * from "./swap/cache/hooks";
