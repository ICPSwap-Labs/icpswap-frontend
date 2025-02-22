import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Grid, Box } from "components/Mui";
import { InfoWrapper, Breadcrumbs } from "components/index";
import { NFTInfo, NFTActivity, NFTTransactions } from "components/info/nft";
import { MainCard } from "@icpswap/ui";
import i18n from "i18n/index";
import { useTranslation } from "react-i18next";

export type Tab = {
  key: string;
  value: string;
  component: FC<{ canisterId: string; tokenId: number }>;
};

const TabList: Tab[] = [
  { key: "Transactions", value: i18n.t("common.transactions"), component: NFTTransactions },
  { key: "Activity", value: i18n.t("common.activity"), component: NFTActivity },
];

export default function NFTView() {
  const { t } = useTranslation();
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
        <Breadcrumbs prevLabel={t("nft.list")} prevLink="/info-nfts" currentLabel={t("nft.details")} />

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
