import { useCallback, useMemo } from "react";
import { Box, useTheme, Typography, Avatar } from "components/Mui";
import { Flex, LoadingRow } from "@icpswap/ui";
import { useAccount } from "store/auth/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useCanisterUserNFTCount, useNFTCanisterList, useCanisterLogo } from "hooks/nft/useNFTCalls";
import { isICPSwapOfficial } from "utils/index";
import type { NFTControllerInfo } from "@icpswap/types";
import { useSelectedCanistersManager } from "store/nft/hooks";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";

const ICPSwapPositionNFTs = [
  "jwh2l-aqaaa-aaaan-qatdq-cai",
  "brx5n-xqaaa-aaaan-qanqa-cai",
  "4lnl6-hqaaa-aaaag-qblla-cai",
];

interface NFTRowUIProps {
  logo: string | undefined;
  name: string;
  amount: number | undefined;
  onClick?: () => void;
}

function NFTRowUI({ logo, name, amount, onClick }: NFTRowUIProps) {
  const theme = useTheme();

  return (
    <Box>
      <Flex
        sx={{
          background: theme.palette.background.level3,
          padding: "16px",
          borderRadius: "12px",
          cursor: "pointer",
          overflow: "hidden",
        }}
        justify="space-between"
        onClick={onClick}
      >
        <Flex gap="0 12px" sx={{ overflow: "hidden" }}>
          <Avatar style={{ width: "48px", height: "48px" }} src={logo ?? ""}>
            &nbsp;
          </Avatar>

          <Box sx={{ overflow: "hidden", flex: 1 }}>
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Typography>

            {nonUndefinedOrNull(amount) ? (
              <Flex
                sx={{
                  margin: "6px 0 0 0",
                  padding: "0 8px",
                  height: "20px",
                  borderRadius: "40px",
                  background: "#4F5A84",
                  width: "fit-content",
                }}
              >
                <Typography fontSize="12px" color="text.primary">
                  {amount}
                </Typography>
              </Flex>
            ) : null}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

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
      <NFTRowUI amount={count ? Number(count) : undefined} logo={logo} name={info.name} onClick={handleNFTClick} />
    </Box>
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
          {nftCanisterList.map((element) => (
            <NFTRow key={element.cid} info={element} />
          ))}
        </Flex>
      )}
    </Box>
  );
}
