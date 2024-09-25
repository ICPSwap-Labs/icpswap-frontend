import { Flex, TextButton, Tooltip } from "@icpswap/ui";
import { Trans } from "@lingui/macro";
import { Typography } from "components/Mui";

export function TopContent() {
  return (
    <Flex gap="0 8px">
      <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>ck-Bridge</Typography>

      <Tooltip
        tips={
          <Typography component="div">
            <Typography
              sx={{
                color: "#111936",
                fontSize: "12px",
                lineHeight: "18px",
              }}
              component="span"
            >
              <Trans>
                Chain Fusion technology enables blockchains like Bitcoin, Ethereum, and Solana to be "fused" together
                with ICP, creating a seamless single-chain end-user experience for multi-chain DApps. Mint native
                Bitcoin, Ethereum, USDC, USDT, and more on ICP using the ck-Bridge.
              </Trans>
            </Typography>
            &nbsp;
            <TextButton
              sx={{
                fontSize: "12px",
                color: "text.theme-secondary",
                textDecoration: "underline",
              }}
              link="https://internetcomputer.org/docs/current/developer-docs/smart-contracts/signatures/t-ecdsa"
            >
              <Trans>View All</Trans>
            </TextButton>
          </Typography>
        }
      />
    </Flex>
  );
}
