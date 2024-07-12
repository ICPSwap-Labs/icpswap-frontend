import { useHistory } from "react-router-dom";
import { Box, Typography, Tooltip } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ReactComponent as QuestionIcon } from "assets/icons/question.svg";

export interface ReclaimLinkProps {
  fontSize?: "12px" | "14px";
}

export function ReclaimLink({ fontSize = "14px" }: ReclaimLinkProps) {
  const history = useHistory();

  return (
    <Typography
      component="div"
      sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      onClick={() => history.push("/swap/reclaim")}
    >
      <Typography color="secondary" mr="5px" sx={{ fontSize }}>
        <Trans>Unreceived tokens after swap? Reclaim here</Trans>
      </Typography>

      <Tooltip
        PopperProps={{
          // @ts-ignore
          sx: {
            "& .MuiTooltip-tooltip": {
              background: "#ffffff",
              borderRadius: "8px",
              padding: "12px 16px",
              "& .MuiTooltip-arrow": {
                color: "#ffffff",
              },
            },
          },
        }}
        title={
          <Box>
            <Typography color="text.400" fontSize="14px" sx={{ lineHeight: "16px" }}>
              <Trans>
                For your funds' safety on ICPSwap, we've implemented the 'Reclaim Your Tokens' feature. If issues arise
                with the token canister during swaps, liquidity withdrawals, or fee claims, or if significant slippage
                causes swap failures, utilize this feature to directly reclaim your tokens.
              </Trans>
            </Typography>
          </Box>
        }
        arrow
      >
        <Box sx={{ width: "12px", height: "12px" }}>
          <QuestionIcon />
        </Box>
      </Tooltip>
    </Typography>
  );
}
