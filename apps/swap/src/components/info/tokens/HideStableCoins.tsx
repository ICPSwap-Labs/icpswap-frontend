import { Flex } from "@icpswap/ui";
import { Checkbox, Typography } from "components/Mui";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

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
  }, [hideStableCoins, onChange, setHideStableCoins]);

  return (
    <Flex gap="0 3px" align="center">
      <Checkbox checked={hideStableCoins} onChange={handleToggle} />
      <Typography sx={{ color: "text.primary", cursor: "pointer", userSelect: "none" }} onClick={handleToggle}>
        Hide Stablecoins
      </Typography>
    </Flex>
  );
}
