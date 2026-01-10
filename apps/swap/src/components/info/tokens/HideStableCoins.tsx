import { Typography, Checkbox } from "components/Mui";
import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { atom, useAtom } from "jotai";

const hideStableCoinsAtom = atom<boolean>(false);

export const useHideStableCoins = () => useAtom(hideStableCoinsAtom);

interface HideStableCoinsProps {
  onChange?: (hideStableCoins: boolean) => void;
}

export function HideStableCoins({ onChange }: HideStableCoinsProps) {
  const [hideStableCoins, setHideStableCoins] = useHideStableCoins();

  const handleToggle = useCallback(() => {
    setHideStableCoins(!hideStableCoins);
    onChange?.(!hideStableCoins);
  }, [hideStableCoins, onChange]);

  return (
    <Flex gap="0 3px" align="center">
      <Checkbox checked={hideStableCoins} onChange={handleToggle} />
      <Typography sx={{ color: "text.primary", cursor: "pointer", userSelect: "none" }} onClick={handleToggle}>
        Hide Stablecoins
      </Typography>
    </Flex>
  );
}
