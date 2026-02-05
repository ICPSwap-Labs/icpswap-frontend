import React, { useState } from "react";
import { Typography, Box } from "components/Mui";
import { useParams } from "react-router-dom";
import { NFTs, NFTLayoutHeader } from "components/info/nft";
import { useNFTCanisterMetadata, useNFTUserCanisterCount, useNFTCanisterCycles } from "hooks/info/nft";
import { InfoWrapper, LoadingRow, Breadcrumbs } from "components/index";
import { MainCard } from "@icpswap/ui";
import i18n from "i18n/index";

type PageType = {
  component: React.FC<{ canisterId: string }>;
  key: string;
  label: React.ReactNode;
};

const Pages: PageType[] = [{ key: "NFTs", label: i18n.t("nfts"), component: NFTs }];

export default function NFTCanisterDetails() {
  const { id: canisterId } = useParams() as { id: string };

  const { result: metadata, loading } = useNFTCanisterMetadata(canisterId);
  const { result: cycles } = useNFTCanisterCycles(canisterId);
  const { result: count } = useNFTUserCanisterCount(canisterId, "");

  const [pageKey, setPageKey] = useState(Pages[0].key);

  const getComponent = () => {
    const Component = Pages.find((page) => page.key === pageKey)?.component ?? Pages[0].component;
    return <Component canisterId={canisterId} />;
  };

  return (
    <InfoWrapper>
      <Box>
        <Breadcrumbs
          prevLink="/info-nfts/canisters"
          prevLabel={i18n.t("nft.canisters")}
          currentLabel={i18n.t("nfts")}
        />

        <Box mt={2}>
          {loading ? (
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          ) : (
            <NFTLayoutHeader details={metadata} cycles={cycles ?? BigInt(0)} count={count ?? BigInt(0)} />
          )}
        </Box>

        <Box mt={2}>
          <MainCard level={3}>
            <Box mb={3}>
              {Pages.map((page) => (
                <Typography
                  fontWeight="700"
                  fontSize="20px"
                  key={page.key}
                  component="span"
                  sx={{ marginRight: "20px", cursor: "pointer" }}
                  onClick={() => setPageKey(page.key)}
                >
                  {page.label}
                </Typography>
              ))}
            </Box>

            {getComponent()}
          </MainCard>
        </Box>
      </Box>
    </InfoWrapper>
  );
}
