import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Grid, Box } from "components/Mui";
import { MainCard, Breadcrumbs } from "components/index";
import NFTTransactions from "components/NFT/NFTTransactions";
import NFTActivity from "components/NFT/NFTActivity";
import NFTInfo from "components/NFT/Info";
import { Trans, t } from "@lingui/macro";
import Wrapper from "components/Wrapper";

export type Tab = {
  key: string;
  value: string;
  component: FC<{ canisterId: string; tokenId: number }>;
};

const TabList: Tab[] = [
  { key: "Transactions", value: t`Transactions`, component: NFTTransactions },
  { key: "Activity", value: t`Activity`, component: NFTActivity },
];

export default function NFTView({ isWallet = false }: { isWallet?: boolean }) {
  const { canisterId, tokenId } = useParams<{ canisterId: string; tokenId: string }>();

  const [tab, setTab] = useState<Tab>(TabList[0]);

  const displayedComponent = () => {
    const ShowedComponent = TabList.filter((item) => item.key === tab.key)[0].component;
    return <ShowedComponent canisterId={canisterId} tokenId={Number(tokenId)} />;
  };

  const onTabChange = (tab: Tab) => {
    setTab(tab);
  };

  return (
    <Wrapper>
      <>
        <Box sx={{ margin: "0 0 20px 0" }}>
          <Breadcrumbs
            prevLink={isWallet ? `/wallet/nft/canister/details/${canisterId}` : "/marketplace/NFT"}
            prevLabel={isWallet ? "NFT List" : "Marketplace"}
            currentLabel={<Trans>NFT Details</Trans>}
          />
        </Box>

        <NFTInfo isView canisterId={canisterId} tokenId={Number(tokenId)} />

        <Box mt="24px">
          <MainCard level={2}>
            <Grid container spacing={3}>
              {TabList.map((item) => (
                <Grid item key={item.key}>
                  <Typography
                    color={item.key === tab.key ? "textPrimary" : "textSecondary"}
                    onClick={() => onTabChange(item)}
                    sx={{
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Box mt={3}>{displayedComponent()}</Box>
          </MainCard>
        </Box>
      </>
    </Wrapper>
  );
}
