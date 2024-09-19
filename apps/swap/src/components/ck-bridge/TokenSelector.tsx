import { useState } from "react";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { ckBridgeChain } from "@icpswap/constants";

import { SelectButton } from "./SelectButton";
import { TokensModal } from "./TokensModal";

export interface BridgeTokenSelectorProps {
  token: Token | Null;
  tokenChain: ckBridgeChain | Null;
  onChange: (token: Token, chain: ckBridgeChain) => void;
  disabled?: boolean;
}

export function BridgeTokenSelector({ token, onChange, tokenChain, disabled = false }: BridgeTokenSelectorProps) {
  const [open, setOpen] = useState(false);

  const onTokenChange = (token: Token, chain: ckBridgeChain) => {
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
