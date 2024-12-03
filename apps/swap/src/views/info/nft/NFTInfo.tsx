import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Grid, Box } from "components/Mui";
import { InfoWrapper, Breadcrumbs } from "components/index";
import { NFTInfo, NFTActivity, NFTTransactions } from "components/info/nft";
import { Trans, t } from "@lingui/macro";
import { MainCard } from "@icpswap/ui";

export type Tab = {
  key: string;
  value: string;
  component: FC<{ canisterId: string; tokenId: number }>;
};

const TabList: Tab[] = [
  { key: "Transactions", value: t`Transactions`, component: NFTTransactions },
  { key: "Activity", value: t`Activity`, component: NFTActivity },
];

export default function NFTView() {
  const { canisterId, id: tokenId } = useParams<{ canisterId: string; id: string }>();

  const [tab, setTab] = useState<Tab>(TabList[0]);

  const displayedComponent = () => {
    const ShowedComponent = TabList.filter((item) => item.key === tab.key)[0].component;
    return <ShowedComponent canisterId={canisterId} tokenId={Number(tokenId)} />;
  };

  const onTabChange = (tab: Tab) => {
    setTab(tab);
  };

  return (
    <InfoWrapper>
      <>
        <Breadcrumbs
          prevLabel={<Trans>NFT List</Trans>}
          prevLink="/info-nfts"
          currentLabel={<Trans>NFT Details</Trans>}
        />

        <NFTInfo isView canisterId={canisterId} tokenId={Number(tokenId)} />

        <Box mt="24px">
          <MainCard level={3}>
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
    </InfoWrapper>
  );
}
