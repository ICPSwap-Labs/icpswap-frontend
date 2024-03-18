import { Box, Typography } from "@mui/material";
import { useSNSTokensRootIds, useSwapSaleParameters, useSNSCanisters, useSNSSwapInitArgs } from "@icpswap/hooks";
import { useMemo } from "react";
import { LoadingRow, TextButton } from "components/index";
import AvatarImage from "components/Image/Avatar";
import { useParams, useHistory } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import { useTokenInfo } from "hooks/token";
import { LaunchDetail } from "./components/LaunchDetails";
import { LaunchStatus } from "./components/LaunchStatus";

export default function Launch() {
  const history = useHistory();
  const { root_id } = useParams<{ root_id: string }>();

  const { result: snsTokens } = useSNSTokensRootIds();

  const sns = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.filter((e) => e.root_canister_id === root_id)[0];
  }, [snsTokens, root_id]);

  const { result: snsCanisterIds } = useSNSCanisters(root_id);

  const { ledger_id, swap_id } = useMemo(() => {
    if (!snsCanisterIds) return { swap_id: undefined, ledger_id: undefined };

    const ledger_id = snsCanisterIds.ledger[0]?.toString();
    const swap_id = snsCanisterIds.swap[0]?.toString();

    return { ledger_id, swap_id };
  }, [snsCanisterIds]);

  const { result: tokenInfo } = useTokenInfo(ledger_id);
  const { result: saleParameters } = useSwapSaleParameters(swap_id);
  const { result: swapInitArgs } = useSNSSwapInitArgs(swap_id);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: "1400px", width: "100%" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: 500, margin: "0 0 20px 0" }} color="text.primary">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => history.push("/sns/launches")} />
        </Typography>

        {!!sns ? (
          <Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
                <AvatarImage style={{ width: "52px", height: "52px" }} src={sns.logo} />
                <Typography color="text.primary" fontSize={24} fontWeight={500}>
                  {sns.name}
                </Typography>
              </Box>
              <Typography sx={{ margin: "10px 0 0 0" }}>{sns.description}</Typography>
              <Typography sx={{ margin: "10px 0 0 0", display: "flex" }} component="div">
                <TextButton link={sns.url}>{sns.url}</TextButton>
                <TextButton link={`https://dashboard.internetcomputer.org/sns/${root_id}`}>ICP Dashboard</TextButton>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "0 20px",
                margin: "20px 0 0 0",
                "@media(max-width: 980px)": {
                  flexDirection: "column",
                  gap: "20px 0",
                },
              }}
            >
              <LaunchDetail
                ledger_id={ledger_id}
                swap_id={swap_id}
                tokenInfo={tokenInfo}
                saleParameters={saleParameters}
                swapInitArgs={swapInitArgs}
              />

              <LaunchStatus
                ledger_id={ledger_id}
                swap_id={swap_id}
                tokenInfo={tokenInfo}
                saleParameters={saleParameters}
                swapInitArgs={swapInitArgs}
              />
            </Box>
          </Box>
        ) : (
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
        )}
      </Box>
    </Box>
  );
}
