import { Typography, Box, useTheme } from "components/Mui";
import { t } from "@lingui/macro";
import { InfoWrapper } from "components/index";
import { Flex, Image, Link } from "@icpswap/ui";

const tools = [
  { label: t`Burn tool`, image: "/images/info/tools/Burn.svg", path: "/info-tools/burn" },
  {
    label: t`Swap Transactions`,
    image: "/images/info/tools/SwapTransactions.svg",
    path: "/info-tools/swap-transactions",
  },
  { label: t`Liquidity Positions`, image: "/images/info/tools/Positions.svg", path: "/info-tools/positions" },
  {
    label: t`Users’ Pool Balances`,
    image: "/images/info/tools/UserPoolBalance.svg",
    path: "/info-tools/user-balances",
  },
  { label: t`Wallet Valuation`, image: "/images/info/tools/WalletValuation.svg", path: "/info-tools/valuation" },
  // { label: t`Position Transfer`, image: "/images/info/tools/PositionTransfer.svg", path: "/info-tools/burn" },
  { label: t`Locked Positions`, image: "/images/info/tools/LockedPositions.svg", path: "/info-tools/locked-positions" },
];

export default function Tools() {
  const theme = useTheme();

  return (
    <InfoWrapper sx={{ padding: "40px 10px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "40px",
          "@media(max-width: 920px)": {
            gridTemplateColumns: "1fr 1fr",
          },
          "@media(max-width: 640px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {tools.map((tool) => (
          <Box
            key={tool.path}
            sx={{
              background: theme.palette.background.level4,
              height: "140px",
              borderRadius: "16px",
            }}
          >
            <Link key={tool.path} to={tool.path}>
              <Box
                sx={{
                  padding: "28px 0 0 0",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Flex fullWidth justify="center">
                  <Image src={tool.image} sx={{ width: "50px", height: "50px", borderRadius: "0px" }} />
                </Flex>
                <Typography sx={{ fontSize: "16px", margin: "12px 0 0 0", textAlign: "center" }} color="text.primary">
                  {tool.label}
                </Typography>
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </InfoWrapper>
  );
}
