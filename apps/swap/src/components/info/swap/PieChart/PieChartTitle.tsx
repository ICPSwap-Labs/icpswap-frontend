import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useMediaQuery640 } from "hooks/theme";
import { Bulb } from "components/info/swap/PieChart/Bulb";

export interface PieChartTitleProps {
  content0: string;
  content1: string;
  content2: string;
}

export function PieChartTitle({ content0, content1, content2 }: PieChartTitleProps) {
  const theme = useTheme();
  const downMedia640 = useMediaQuery640();

  return (
    <Flex
      sx={{
        height: downMedia640 ? "auto" : "72px",
        borderBottom: `1px solid ${theme.palette.border.border4}`,
        padding: downMedia640 ? "0 16px" : "0px",
      }}
      vertical={downMedia640}
    >
      <Box
        sx={{
          flex: downMedia640 ? "100%" : "50%",
          width: downMedia640 ? "100%" : "fit-content",
          padding: "16px 0",
        }}
      >
        <Flex fullWidth gap="0 4px" justify={downMedia640 ? "left" : "center"} align={downMedia640 ? "top" : "center"}>
          <Bulb />

          <Typography
            color="text.primary"
            sx={{ "@media(max-width: 640px)": { fontSize: "12px", lineHeight: "18px" } }}
          >
            {content0}
          </Typography>
        </Flex>
      </Box>

      <Box
        sx={{
          flex: downMedia640 ? "100%" : "50%",
          borderTop: downMedia640 ? `1px solid ${theme.palette.border.border4}` : "none",
          padding: "16px 0",
          width: downMedia640 ? "100%" : "fit-content",
        }}
      >
        <Flex
          fullWidth
          justify={downMedia640 ? "left" : "center"}
          gap="0 4px"
          align={downMedia640 ? "top" : "center"}
          sx={{ borderLeft: downMedia640 ? "none" : `1px solid ${theme.palette.border.border4}` }}
        >
          <Bulb />

          <Flex vertical={downMedia640} gap="10px 0" align={downMedia640 ? "left" : "center"}>
            <Typography
              color="text.primary"
              sx={{
                paddingRight: "8px",
                borderRight: "1px solid #ffffff",
                "@media(max-width: 640px)": { fontSize: "12px" },
              }}
            >
              {content1}
            </Typography>

            <Typography
              color="text.primary"
              sx={{
                paddingLeft: downMedia640 ? "0px" : "8px",
                "@media(max-width: 640px)": { fontSize: "12px" },
              }}
            >
              {content2}
            </Typography>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
