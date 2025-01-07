import { useTheme, Box } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { BigNumber } from "@icpswap/utils";

const levels = [0, 1, 2, 3, 4];

interface NetworkStateIconProps {
  level: number;
  height?: string;
}

export function NetworkStateIcon({ level, height = "11px" }: NetworkStateIconProps) {
  const theme = useTheme();

  return (
    <Flex align="flex-end" sx={{ gap: "0 1.5px" }}>
      {levels.map((element, index) => (
        <Box
          key={element}
          sx={{
            width: "2px",
            height: `${new BigNumber(index + 1).dividedBy(levels.length).multipliedBy(parseInt(height)).toNumber()}px`,
            background:
              element <= level
                ? level >= 3
                  ? "#54C081"
                  : level <= 1
                  ? "#D3625B"
                  : "#F7B231"
                : theme.palette.background.level4,
            borderRadius: "30px",
          }}
        />
      ))}
    </Flex>
  );
}
