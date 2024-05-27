import { Grid, Typography, Box, Link } from "@mui/material";
import { BoxItem } from "ui-component/token-list/BoxItem";
import { makeStyles } from "@mui/styles";
import { useEffect, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTokenInfo } from "hooks/token/index";
import { useToken } from "hooks/useToken";
import { Trans, t } from "@lingui/macro";
import { MainContainer, MainCard, TokenImage } from "ui-component/index";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import TokenStandardLabel from "ui-component/TokenStandardLabel";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useICPPrice } from "store/global/hooks";
import BigNumber from "bignumber.js";
import { formatDollarAmount, formatAmount, toSignificant, parseTokenAmount, explorerLink } from "@icpswap/utils";
import { useTokenTotalHolder, useTokenSupply, useTokenListTokenInfo, useParsedQueryString } from "@icpswap/hooks";
import { useCanisterInfo } from "hooks/useInternetComputerCalls";
import MediaLinks from "ui-component/MediaLink";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { TextButton } from "@icpswap/ui";
// import Breadcrumbs from "ui-component/Breadcrumbs";
import { useUpdateTokenStandards, useTokenStandardIsRegistered } from "store/token/cache/hooks";

const useStyles = makeStyles({
  box: {
    background: "#29314F",
    borderRadius: "12px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gridGap: "16px",
    "@media screen and (min-width:960px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridGap: "16px",
    },
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#313A5A",
    opacity: 0.4,
  },
});

export function TokenDetail() {
  const classes = useStyles();
  const history = useHistory();

  const { canisterId } = useParams<{ canisterId: string }>();

  const { result: tokenInfo } = useTokenInfo(canisterId);
  const { result: totalHolder } = useTokenTotalHolder(canisterId);
  const { result: supply } = useTokenSupply(canisterId);

  const [, currency] = useToken(canisterId);

  const ICPPrice = useICPPrice();

  const tokenUSDPrice = useUSDPrice(currency?.address);

  const { result: canisterInfo } = useCanisterInfo(canisterId);
  const { result: tokenListInfo } = useTokenListTokenInfo(canisterId);

  const mediaLinks = useMemo(() => {
    if (!tokenListInfo) return [];
    return tokenListInfo?.mediaLinks.map((mediaLink) => ({ k: mediaLink.mediaType, v: mediaLink.link })) ?? [];
  }, [tokenListInfo]);

  const handleToTransactions = () => {
    history.push(`/token/transactions/${canisterId}`);
  };

  return (
    <MainContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", overflow: "hidden", display: "grid", gap: "20px 0" }}>
          {/* <Breadcrumbs
            prevLink={`/token/list`}
            prevLabel={<Trans>Token List</Trans>}
            currentLabel={<Trans>Details</Trans>}
         /> */}

          <MainCard>
            <Typography fontSize="20px" fontWeight="700">
              <Trans>Token Details</Trans>
            </Typography>

            <Box sx={{ margin: "8px 0 32px 0" }}>
              <Typography sx={{ fontSize: "12px" }}>
                <Trans>
                  Disclaimer: Do your own research before investing. While we've collected known information about
                  tokens on the list, it's essential to conduct your research.
                </Trans>
              </Typography>
            </Box>

            <Box mt="20px" sx={{ overflow: "hidden", display: "grid", gap: "12px 0" }}>
              <Box className={classes.box}>
                <BoxItem
                  title={t`Symbol`}
                  CustomChild={
                    <Grid
                      container
                      alignItems="center"
                      sx={{ gap: "0 8px", "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
                    >
                      {tokenInfo?.logo ? (
                        <TokenImage logo={tokenInfo.logo} size="22px" tokenId={tokenInfo.canisterId} />
                      ) : null}
                      {tokenInfo?.symbol}
                      <TokenStandardLabel standard={tokenInfo?.standardType as TOKEN_STANDARD} />
                    </Grid>
                  }
                  border={{ borderRadius: "12px 0 0 0" }}
                />
                <Box className={classes.divider} />
                <BoxItem title={t`Name`} value={tokenInfo?.name} />
                <Box className={classes.divider} />
                <BoxItem
                  title={t`Total Supply`}
                  value={supply ? parseTokenAmount(supply, tokenInfo?.decimals).toFormat() : "--"}
                  border={{ borderRadius: "0 0 0 12px" }}
                />
              </Box>

              <Box className={classes.box}>
                <BoxItem
                  title="Decimals"
                  value={tokenInfo?.decimals?.toString()}
                  border={{ borderRadius: "12px 0 0 0" }}
                />
                <Box className={classes.divider} />
                <BoxItem
                  title={t`Transfer Fee`}
                  value={parseTokenAmount(tokenInfo?.transFee, tokenInfo?.decimals).toFormat()}
                />
                <Box className={classes.divider} />
                <BoxItem
                  title={t`Holders`}
                  CustomChild={
                    <Grid container alignItems="center">
                      <Grid item xs>
                        <Typography
                          color="text.primary"
                          sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
                        >
                          {totalHolder ? String(totalHolder) : "--"}
                        </Typography>
                      </Grid>
                      <TextButton to={`/token/holders/${canisterId}`}>
                        <Trans>Details</Trans>
                      </TextButton>
                      <Box sx={{ width: "40px" }} />
                    </Grid>
                  }
                  border={{ borderRadius: "0 0 0 12px" }}
                />
              </Box>

              <Box className={classes.box}>
                <BoxItem
                  CustomChild={
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography
                          color="text.primary"
                          sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
                        >
                          {tokenUSDPrice && ICPPrice
                            ? `${toSignificant(new BigNumber(tokenUSDPrice).dividedBy(ICPPrice).toNumber(), 8)} ICP`
                            : "--"}
                        </Typography>
                        <Typography sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}>
                          {tokenUSDPrice && ICPPrice
                            ? formatDollarAmount(new BigNumber(tokenUSDPrice).toNumber(), 8)
                            : "--"}
                        </Typography>
                      </Box>
                      <TextButton to={`/swap/token/details/${canisterId}`} sx={{ padding: "0 40px 0 0" }}>
                        <Trans>Details</Trans>
                      </TextButton>
                    </Grid>
                  }
                  title={t`Price`}
                  border={{ borderRadius: "12px 0 0 12px" }}
                />
              </Box>

              <Box className={classes.box}>
                <BoxItem
                  CustomChild={
                    <Grid container alignItems="center">
                      <Box>
                        <Typography
                          color="text.primary"
                          sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
                        >
                          {tokenUSDPrice && ICPPrice && supply
                            ? `${formatAmount(
                                new BigNumber(tokenUSDPrice)
                                  .multipliedBy(parseTokenAmount(supply, currency?.decimals))
                                  .dividedBy(ICPPrice)
                                  .toNumber(),
                              )} ICP`
                            : "--"}
                        </Typography>
                        <Typography sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}>
                          {tokenUSDPrice && ICPPrice && supply
                            ? formatDollarAmount(
                                new BigNumber(tokenUSDPrice)
                                  .multipliedBy(parseTokenAmount(supply, currency?.decimals))
                                  .toNumber(),
                              )
                            : "--"}
                        </Typography>
                      </Box>
                    </Grid>
                  }
                  title={t`Market Cap`}
                  border={{ borderRadius: "12px 0 0 12px" }}
                />
              </Box>

              <Box className={classes.box}>
                <BoxItem
                  CustomChild={
                    <Link
                      href={explorerLink(canisterId)}
                      target="_blank"
                      sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
                    >
                      {canisterId}
                    </Link>
                  }
                  title={t`Canister ID`}
                  border={{ borderRadius: "12px 0 0 12px" }}
                />
              </Box>

              <Box className={classes.box}>
                <BoxItem
                  CustomChild={
                    <Box sx={{ padding: "14px 0 14px 0" }}>
                      {canisterInfo?.controllers.map((controller, index) => (
                        <Typography
                          key={index}
                          color="text.primary"
                          sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
                        >
                          {controller}
                        </Typography>
                      ))}
                    </Box>
                  }
                  title={t`Controller`}
                  border={{ borderRadius: "12px 0 0 12px" }}
                />
              </Box>
            </Box>
          </MainCard>

          {mediaLinks.length > 0 ? (
            <MainCard>
              <Typography fontWeight={500}>
                <Trans>Social Media Links</Trans>
              </Typography>

              <Box mt="16px">
                <MediaLinks links={mediaLinks} />
              </Box>
            </MainCard>
          ) : null}

          {!!tokenListInfo && tokenListInfo?.introduction ? (
            <MainCard>
              <Typography fontWeight={500}>
                <Trans>Introduction</Trans>
              </Typography>

              <Box mt="16px">
                <Typography color="text.primary">{tokenListInfo?.introduction}</Typography>
              </Box>
            </MainCard>
          ) : null}

          <MainCard>
            <Grid container alignItems="center" sx={{ cursor: "pointer" }} onClick={handleToTransactions}>
              <Grid item xs>
                <Typography fontWeight={500} color="text.primary">
                  <Trans>Transactions</Trans>
                </Typography>
              </Grid>

              <KeyboardArrowRightIcon color="secondary" />
            </Grid>
          </MainCard>
        </Box>
      </Box>
    </MainContainer>
  );
}

export default function Details() {
  const updateTokenStandard = useUpdateTokenStandards();
  const { canisterId } = useParams<{ canisterId: string }>();

  const { standard } = useParsedQueryString() as { standard: TOKEN_STANDARD };

  useEffect(() => {
    if (standard) {
      updateTokenStandard({ canisterId, standard });
    }
  }, [standard, canisterId]);

  const tokenStandardIsRegistered = useTokenStandardIsRegistered(canisterId);

  return tokenStandardIsRegistered ? <TokenDetail /> : null;
}
