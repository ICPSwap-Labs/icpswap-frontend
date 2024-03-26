import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import NFTList from "ui-component/NFT/NFTList";
import CanisterHeader from "ui-component/NFT/CanisterHeader";
import { useNFTCanisterMetadata, useCanisterCycles, useCanisterUserNFTCount } from "hooks/nft/calls";
import { t, Trans } from "@lingui/macro";
import { type NFTCanisterInfo } from "@icpswap/types";
import { Wrapper, LoadingRow, Breadcrumbs } from "ui-component/index";
import { MainCard } from "@icpswap/ui";

type PageType = {
  component: React.FC<{ canisterId: string }>;
  key: string;
  label: React.ReactNode;
};

const Pages: PageType[] = [{ key: "NFTs", label: t`NFTs`, component: NFTList }];

export default function NFTCanisterDetails() {
  const { id: canisterId } = useParams<{ id: string }>();

  const { result: metadata, loading } = useNFTCanisterMetadata(canisterId);
  const { result: cycles } = useCanisterCycles(canisterId);
  const { result: count } = useCanisterUserNFTCount(canisterId, "");

  const [pageKey, setPageKey] = useState(Pages[0].key);

  const getComponent = () => {
    const Component = Pages.find((page) => page.key === pageKey)?.component ?? Pages[0].component;
    return <Component canisterId={canisterId} />;
  };

  return (
    <Wrapper>
      <Box>
        <Breadcrumbs
          prevLink="/nft/canisters"
          prevLabel={<Trans>NFT Canisters</Trans>}
          currentLabel={<Trans>NFTs</Trans>}
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
            <CanisterHeader
              details={metadata ?? ({} as NFTCanisterInfo)}
              cycles={cycles ?? BigInt(0)}
              count={count ?? BigInt(0)}
            />
          )}
        </Box>

        <Box mt={2}>
          <MainCard level={2}>
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
    </Wrapper>
  );
}
