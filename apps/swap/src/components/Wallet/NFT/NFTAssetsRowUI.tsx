import { Box, useTheme, Typography, Avatar } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";

export interface NFTAssetsRowUIProps {
  logo: string | undefined;
  name: string;
  amount: number | undefined;
  onClick?: () => void;
}

export function NFTAssetsRowUI({ logo, name, amount, onClick }: NFTAssetsRowUIProps) {
  const theme = useTheme();

  return (
    <Box>
      <Flex
        sx={{
          background: theme.palette.background.level3,
          padding: "16px",
          borderRadius: "12px",
          cursor: "pointer",
          overflow: "hidden",
        }}
        justify="space-between"
        onClick={onClick}
      >
        <Flex gap="0 12px" sx={{ overflow: "hidden" }}>
          <Avatar style={{ width: "48px", height: "48px" }} src={logo ?? ""}>
            &nbsp;
          </Avatar>

          <Box sx={{ overflow: "hidden", flex: 1 }}>
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Typography>

            <Flex
              sx={{
                margin: "6px 0 0 0",
                padding: "0 8px",
                height: "20px",
                borderRadius: "40px",
                background: "#4F5A84",
                width: "fit-content",
                visibility: nonUndefinedOrNull(amount) ? "visible" : "hidden",
              }}
            >
              <Typography fontSize="12px" color="text.primary">
                {amount}
              </Typography>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
