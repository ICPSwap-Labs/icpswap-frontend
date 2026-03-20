import type { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { useState } from "react";

import { SelectButton } from "./SelectButton";
import { TokensModal } from "./TokensModal";

export interface BridgeTokenSelectorProps {
  token: Token | Null;
  tokenChain: BridgeChainType | Null;
  onChange: (token: Token, chain: BridgeChainType) => void;
  disabled?: boolean;
}

export function BridgeTokenSelector({ token, onChange, tokenChain, disabled = false }: BridgeTokenSelectorProps) {
  const [open, setOpen] = useState(false);

  const onTokenChange = (token: Token, chain: BridgeChainType) => {
    if (onChange) onChange(token, chain);
    setOpen(false);
  };

  return (
    <>
      <SelectButton
        from
        select
        token={token}
        chain={tokenChain}
        onClick={() => {
          if (disabled) return;
          setOpen(true);
        }}
      />

      {open && <TokensModal open={open} onClose={() => setOpen(false)} onChange={onTokenChange} />}
    </>
  );
}
