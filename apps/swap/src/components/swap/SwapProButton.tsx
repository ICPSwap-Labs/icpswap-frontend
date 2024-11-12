import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";

export function SwapProButton() {
  const theme = useTheme();
  const history = useHistory();

  const handleToSwapPro = useCallback(() => {
    history.push("/swap/pro");
  }, [history]);

  return (
    <Flex
      onClick={handleToSwapPro}
      sx={{
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "40px",
        background: theme.palette.background.level3,
      }}
    >
      <img width="16px" height="16px" src="/images/chart.svg" alt="" />
    </Flex>
  );
}
