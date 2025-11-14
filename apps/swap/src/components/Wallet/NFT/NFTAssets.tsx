import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "components/Mui";
import { Flex, LoadingRow, NoData } from "@icpswap/ui";
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
import { useHideZeroNFTManager } from "store/wallet/hooks";

const ICPSwapPositionNFTs = [
  "jwh2l-aqaaa-aaaan-qatdq-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  "4lnl6-hqaaa-aaaag-qblla-cai",
];

interface NFTRowProps {
  info: NFTControllerInfo;
  updateHidedNFTs: (id: string, num: number) => void;
}

function NFTRow({ info, updateHidedNFTs }: NFTRowProps) {
  const account = useAccount();
  const { setDisplayedNFTInfo } = useWalletNFTContext();
  const { setPages } = useWalletContext();
  const [hideZeroNFT] = useHideZeroNFTManager();

  const { result: count } = useCanisterUserNFTCount(info.cid, account);
  const { result: logo } = useCanisterLogo(info.cid);

  const handleNFTClick = useCallback(() => {
    setDisplayedNFTInfo({
      id: info.cid,
      name: info.name,
    });

    setPages(WalletManagerPage.NFTCanister, false);
  }, [setDisplayedNFTInfo, setPages, info]);

  const isHidden = useMemo(() => {
    return nonUndefinedOrNull(count) && hideZeroNFT && Number(count) === 0;
  }, [count, hideZeroNFT]);

  useEffect(() => {
    if (isHidden && nonUndefinedOrNull(count)) {
      updateHidedNFTs(info.cid, Number(count));
    }
  }, [info, count, hideZeroNFT]);

  return (
    <Box
      sx={{
        padding: "0 12px",
        width: "100%",
        display: isHidden ? "none" : "block",
      }}
    >
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
  updateHidedNFTs: (id: string, num: number) => void;
}

function ExtNFTRow({ metadata, userAllExtNfts, updateHidedNFTs }: ExtNFTRowProps) {
  const { setDisplayedNFTInfo } = useWalletNFTContext();
  const { setPages } = useWalletContext();
  const [hideZeroNFT] = useHideZeroNFTManager();

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

  const isHidden = useMemo(() => {
    return nonUndefinedOrNull(count) && hideZeroNFT && Number(count) === 0;
  }, [count, hideZeroNFT]);

  useEffect(() => {
    if (nonUndefinedOrNull(count)) {
      updateHidedNFTs(metadata.id, count);
    }
  }, [metadata, count, hideZeroNFT]);

  return (
    <Box sx={{ padding: "0 12px", width: "100%", display: isHidden ? "none" : "block" }}>
      <NFTAssetsRowUI
        amount={nonUndefinedOrNull(count) ? Number(count) : undefined}
        logo={metadata.avatar}
        name={metadata.name}
        onClick={handleNFTClick}
      />
    </Box>
  );
}

interface ExtNFTsProps {
  updateHidedNFTs: (id: string) => void;
  updateExtNFTsLength: (num: number) => void;
}

function ExtNFTs({ updateHidedNFTs, updateExtNFTsLength }: ExtNFTsProps) {
  const principal = useAccountPrincipalString();
  const { result: userAllExtNfts } = useExtUserNFTs(principal);
  const { nfts: importedExtNFTIds } = useEXTManager();
  const { result: extNFTs } = useEXTAllCollections();

  const importedExtNFTs = useMemo(() => {
    if (isUndefinedOrNull(extNFTs) || isUndefinedOrNull(importedExtNFTIds)) return undefined;

    return importedExtNFTIds
      .map((nft) => extNFTs.find((element) => element.id === nft.canisterId))
      .filter((element) => nonUndefinedOrNull(element)) as Array<EXTCollection>;
  }, [importedExtNFTIds, extNFTs]);

  useEffect(() => {
    if (nonUndefinedOrNull(importedExtNFTs)) {
      updateExtNFTsLength(importedExtNFTs.length);
    }
  }, [updateExtNFTsLength, importedExtNFTs]);

  return (
    <>
      {(importedExtNFTs ?? []).map((element) => (
        <ExtNFTRow
          key={element.id}
          metadata={element}
          userAllExtNfts={userAllExtNfts}
          updateHidedNFTs={updateHidedNFTs}
        />
      ))}
    </>
  );
}

export function NFTAssets() {
  const { result: nftResult, loading } = useNFTCanisterList(0, 1000);
  const [hidedNFTs, setHidedNFTs] = useState<Array<string>>([]);
  const [extNFTsLength, setExtNFTsLength] = useState<number | undefined>(undefined);
  const [hideZeroNFT] = useHideZeroNFTManager();

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

  const handleUpdateHidedNFTs = useCallback(
    (canisterId: string) => {
      setHidedNFTs((prevState) => {
        return [...new Set([...prevState, canisterId])];
      });
    },
    [setHidedNFTs],
  );

  const noData = useMemo(() => {
    // always has NFT list, so only hideZeroNFT is true there will be no data
    if (hideZeroNFT === false) return false;
    if (isUndefinedOrNull(extNFTsLength)) return false;
    return hidedNFTs.length === extNFTsLength + nftCanisterList.length;
  }, [hidedNFTs, nftCanisterList, extNFTsLength, hideZeroNFT]);

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
      ) : noData ? (
        <NoData tip="No NFTs found" />
      ) : null}

      <Flex gap="12px 0" fullWidth align="flex-start" vertical sx={{ display: !noData ? "flex" : "none" }}>
        <ExtNFTs updateHidedNFTs={handleUpdateHidedNFTs} updateExtNFTsLength={setExtNFTsLength} />

        {nftCanisterList.map((element) => (
          <NFTRow key={element.cid} info={element} updateHidedNFTs={handleUpdateHidedNFTs} />
        ))}
      </Flex>
    </Box>
  );
}
