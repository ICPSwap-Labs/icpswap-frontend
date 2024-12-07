import { useParams } from "react-router-dom";
import { Box, Typography, useTheme } from "components/Mui";
import { InfoWrapper } from "components/index";
import { Trans } from "@lingui/macro";
import { BreadcrumbsV1 } from "@icpswap/ui";
import { Holders } from "components/info/tokens";

export default function __Holders() {
  const theme = useTheme();

  const { id: tokenId } = useParams<{ id: string }>();

  return (
    <InfoWrapper>
      <BreadcrumbsV1
        links={[
          { link: "/info-tokens", label: <Trans>Tokens</Trans> },
          {
            link: `/info-tokens/details/${tokenId}`,
            label: <Trans>Token Details</Trans>,
          },
          {
            label: <Trans>Holders</Trans>,
          },
        ]}
      />

      <Box sx={{ background: theme.palette.background.level3, borderRadius: "16px", margin: "16px 0 0 0" }}>
        <Typography
          sx={{
            fontSize: "20px",
            padding: "24px",
            fontWeight: 600,
            borderBottom: `1px solid ${theme.palette.border.level1}`,
          }}
        >
          <Trans>Holders</Trans>
        </Typography>

        <Holders tokenId={tokenId} />
      </Box>
    </InfoWrapper>
  );
}
