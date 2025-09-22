import { useMemo } from "react";
import { useToken } from "hooks/index";
import { useGlobalMinterInfoManager } from "store/global/hooks";

interface UseErc20TokenFromSymbolProps {
  token_symbol: string;
}

export function useErc20TokenFromSymbol({ token_symbol }: UseErc20TokenFromSymbolProps) {
  const [minterInfo] = useGlobalMinterInfoManager();

  const { ledger_id } = useMemo(() => {
    if (!minterInfo) return {};

    const supported_tokens = minterInfo.supported_ckerc20_tokens[0];

    if (!supported_tokens) return {};

    const ckerc20_token = supported_tokens.find((supported_token) => {
      return supported_token.ckerc20_token_symbol === token_symbol;
    });

    if (!ckerc20_token) return {};

    return {
      ledger_id: ckerc20_token.ledger_canister_id.toString(),
    };
  }, [minterInfo, token_symbol]);

  const [, token] = useToken(ledger_id);

  return useMemo(() => token, [token]);
}
