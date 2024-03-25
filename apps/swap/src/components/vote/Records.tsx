import { useState, useEffect } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/styles";
import { valueofUser , timestampFormat, pageArgsFormat } from "@icpswap/utils";
import { getVotingTransactions } from "@icpswap/hooks";
import { Trans } from "@lingui/macro";
import { UserVoteRecord } from "@icpswap/types";
import { NoData, StaticLoading, MainCard } from "components/index";
import { Theme } from "@mui/material/styles";
import { useDownloadVotes } from "hooks/voting/useDownloadVotes";

export function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0H0V16H16V0Z" fill="white" fillOpacity="0.01" />
      <path d="M3 8.00231V13H13V8" stroke="#8492C4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 7.72266L8 10.2227L5.5 7.72266" stroke="#8492C4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.99609 3V10.2222" stroke="#8492C4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VoteRecords({ canisterId, id }: { canisterId: string; id: string }) {
  const theme = useTheme() as Theme;

  const [totalElements, setTotalElements] = useState<bigint | number>(BigInt(0));
  const [records, setRecords] = useState<UserVoteRecord[]>([] as UserVoteRecord[]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });

  const handleSeeMore = async () => {
    const [offset] = pageArgsFormat(pagination.pageNum + 1, pagination.pageSize);

    setPagination({
      pageNum: pagination.pageNum + 1,
      pageSize: pagination.pageSize,
    });

    setLoading(true);
    const result = await getVotingTransactions(canisterId, id, offset, pagination.pageSize);
    setLoading(false);
    const { content: moreRecords, totalElements } = result ?? {
      totalElements: BigInt(0),
      content: [] as UserVoteRecord[],
    };
    setTotalElements(totalElements);
    setRecords([...records, ...moreRecords]);
  };

  useEffect(() => {
    if (!id) return;

    const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

    (async () => {
      setLoading(true);
      const result = await getVotingTransactions(canisterId, id, offset, pagination.pageSize);
      setLoading(false);
      const { content: records, totalElements } = result ?? {
        totalElements: BigInt(0),
        content: [] as UserVoteRecord[],
      };
      setTotalElements(totalElements);
      setRecords(records);
    })();
  }, [id, canisterId]);

  const [downloading, downloadVotes] = useDownloadVotes(canisterId, id);

  return (
    <MainCard>
      <Grid container alignItems="center">
        <Grid item xs>
          <Grid container alignItems="center">
            <Typography color="text.primary" fontWeight="500">
              <Trans>Votes</Trans>
            </Typography>
            <Box
              sx={{
                marginLeft: "6px",
                borderRadius: "9999px",
                background: "#8492C4",
                padding: "4px",
                minWidth: "16px",
                height: "16px",
                display: "flex",
                width: "fix-content",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.primary" fontWeight="500" fontSize={12}>
                {String(totalElements)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid>
          <Grid container alignItems="center" sx={{ cursor: "pointer" }} onClick={downloadVotes}>
            {downloading ? <CircularProgress sx={{ color: "#8492C4" }} size="16px" /> : <DownloadIcon />}

            <Typography sx={{ marginLeft: "8px" }}>
              <Trans>Download</Trans>
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Box mt="20px">
        <Box
          sx={{
            maxHeight: "350px",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(150px, 1fr) minmax(350px, 2.5fr) minmax(150px, 1fr) minmax(150px, 1fr)",
              height: "60px",
              alignItems: "center",
              borderBottom: `1px solid ${theme.palette.background.level4}`,
            }}
          >
            <Box>
              <Typography>
                <Trans>Voting Time</Trans>
              </Typography>
            </Box>

            <Box>
              <Typography>
                <Trans>Address</Trans>
              </Typography>
            </Box>

            <Box>
              <Typography>
                <Trans>Option</Trans>
              </Typography>
            </Box>

            <Box>
              <Typography>
                <Trans>Powers</Trans>
              </Typography>
            </Box>
          </Box>
          {records.map((record, index) => (
            <Box
              key={`${String(record.voteTime)}-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(150px, 1fr) minmax(350px, 2.5fr) minmax(150px, 1fr) minmax(150px, 1fr)",
                height: "60px",
                alignItems: "center",
                borderBottom: `1px solid ${theme.palette.background.level4}`,
              }}
            >
              <Box>
                <Typography>{timestampFormat(record.voteTime)}</Typography>
              </Box>

              <Box>
                <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "95%" }}>
                  {valueofUser(record.address).toString()}
                </Typography>
              </Box>

              <Box>
                <Typography>{record.options[0].k}</Typography>
              </Box>

              <Box>
                <Typography>
                  <Trans>{record.usedProof} Votes</Trans>
                </Typography>
              </Box>
            </Box>
          ))}

          {records.length >= Number(totalElements) ? null : (
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "60px",
                borderBottom: `1px solid ${theme.palette.background.level4}`,
                cursor: "pointer",
              }}
              onClick={handleSeeMore}
            >
              {loading ? (
                <CircularProgress size={22} />
              ) : (
                <Typography>
                  <Trans>See more</Trans>
                </Typography>
              )}
            </Grid>
          )}

          {loading ? <StaticLoading loading={loading} /> : null}

          {records.length === 0 && !loading ? <NoData /> : null}
        </Box>
      </Box>
    </MainCard>
  );
}
