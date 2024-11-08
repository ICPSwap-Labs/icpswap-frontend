import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";
import { ArrowRight } from "react-feather";

interface UserLimitOrdersProps {
  onClick: () => void;
}

export function UserLimitPanel({ onClick }: UserLimitOrdersProps) {
  const theme = useTheme();

  return (
    <Box
      mt="8px"
      sx={{
        display: "block",
        width: "100%",
        background: theme.palette.background.level1,
        padding: "24px",
        borderRadius: "16px",
        cursor: "pointer",
      }}
    >
      <Flex justify="space-between" onClick={onClick}>
        <Typography>
          <Trans>Limit Order History</Trans>
        </Typography>
        <ArrowRight size={18} />
      </Flex>
    </Box>
  );
}
