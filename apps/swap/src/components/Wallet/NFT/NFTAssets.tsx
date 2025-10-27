import { useCallback, useMemo } from "react";
import { Box } from "components/Mui";
import { Flex, LoadingRow } from "@icpswap/ui";
import { useAccount, useAccountPrincipalString } from "store/auth/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useCanisterUserNFTCount, useNFTCanisterList, useCanisterLogo } from "hooks/nft/useNFTCalls";
import { isICPSwapOfficial } from "utils/index";
import { useEXTManager, useSelectedCanistersManager } from "store/nft/hooks";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useEXTAllCollections, useExtUserNFTs } from "@icpswap/hooks";
import type { NFTControllerInfo, EXTCollection, ExtNft } from "@icpswap/types";
import { NFTAssetsRowUI } from "components/Wallet/NFT/NFTAssetsRowUI";

const ICPSwapPositionNFTs = [
  "jwh2l-aqaaa-aaaan-qatdq-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  "4lnl6-hqaaa-aaaag-qblla-cai",
];

interface NFTRowProps {
  info: NFTControllerInfo;
}

function NFTRow({ info }: NFTRowProps) {
  const account = useAccount();
  const { setDisplayedNFTInfo } = useWalletNFTContext();
  const { setPages } = useWalletContext();

  const { result: count } = useCanisterUserNFTCount(info.cid, account);
  const { result: logo } = useCanisterLogo(info.cid);

  const handleNFTClick = useCallback(() => {
    setDisplayedNFTInfo({
      id: info.cid,
      name: info.name,
    });

    setPages(WalletManagerPage.NFTCanister, false);
  }, [setDisplayedNFTInfo, setPages, info]);

  return (
    <Box sx={{ padding: "0 12px", width: "100%" }}>
      <NFTAssetsRowUI
        amount={nonUndefinedOrNull(count) ? Number(count) : undefined}
        logo={logo}
        name={info.name}
        onClick={handleNFTClick}
      />
    </Box>
  );
}

interface ExtNFTRowProps {
  metadata: EXTCollection;
  userAllExtNfts: ExtNft[] | undefined;
}

function ExtNFTRow({ metadata, userAllExtNfts }: ExtNFTRowProps) {
  const { setDisplayedNFTInfo } = useWalletNFTContext();
  const { setPages } = useWalletContext();

  const handleNFTClick = useCallback(() => {
    setDisplayedNFTInfo({
      id: metadata.id,
      name: metadata.name,
    });

    setPages(WalletManagerPage.NFTExtCanister, false);
  }, [setDisplayedNFTInfo, setPages, metadata]);

  const count = useMemo(() => {
    if (isUndefinedOrNull(userAllExtNfts)) return undefined;
    return userAllExtNfts.filter((element) => element.canister === metadata.id).length;
  }, [userAllExtNfts, metadata]);

  return (
    <Box sx={{ padding: "0 12px", width: "100%" }}>
      <NFTAssetsRowUI
        amount={nonUndefinedOrNull(count) ? Number(count) : undefined}
        logo={metadata.avatar}
        name={metadata.name}
        onClick={handleNFTClick}
      />
    </Box>
  );
}

function ExtNFTs() {
  const principal = useAccountPrincipalString();
  const { result: userAllExtNfts } = useExtUserNFTs(principal);
  const { nfts: importedExtNFTIds } = useEXTManager();
  const { result: extNFTs } = useEXTAllCollections();

  const importedExtNFTs = useMemo(() => {
    if (isUndefinedOrNull(extNFTs) || isUndefinedOrNull(importedExtNFTIds)) return [];

    return importedExtNFTIds
      .map((nft) => extNFTs.find((element) => element.id === nft.canisterId))
      .filter((element) => nonUndefinedOrNull(element)) as Array<EXTCollection>;
  }, [importedExtNFTIds, extNFTs]);

  return (
    <>
      {importedExtNFTs.map((element) => (
        <ExtNFTRow key={element.id} metadata={element} userAllExtNfts={userAllExtNfts} />
      ))}
    </>
  );
}

export function NFTAssets() {
  const { result: nftResult, loading } = useNFTCanisterList(0, 1000);

  const [userSelectedCanisters] = useSelectedCanistersManager();

  const nftCanisterList = useMemo(() => {
    if (isUndefinedOrNull(nftResult)) return [];

    return nftResult.content.filter((canister) => {
      return (
        (userSelectedCanisters.includes(canister.cid) || isICPSwapOfficial(canister.owner)) &&
        !ICPSwapPositionNFTs.includes(canister.cid) // Filter ICPSwap Position NFTs
      );
    });
  }, [userSelectedCanisters, nftResult]);

  return (
    <Box sx={{ margin: "22px 0 20px 0" }}>
      {loading ? (
        <Box sx={{ padding: "0 12px" }}>
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
        </Box>
      ) : (
        <Flex gap="12px 0" fullWidth align="flex-start" vertical>
          <ExtNFTs />

          {nftCanisterList.map((element) => (
            <NFTRow key={element.cid} info={element} />
          ))}
        </Flex>
      )}
    </Box>
  );
}
