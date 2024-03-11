import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, Avatar, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { pageArgsFormat } from "@icpswap/utils";
import { Wrapper, MainCard } from "components/index";
import { Trans } from "@lingui/macro";
import { ProjectInfo } from "@icpswap/types";
import { Pagination, PaginationType, NoData, StaticLoading } from "components/index";
import { useVotingProjects } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";

export interface VoteItemProps {
  project: ProjectInfo;
}

export function VoteItem({ project }: VoteItemProps) {
  const theme = useTheme() as Theme;
  const history = useHistory();

  const handleEnter = () => {
    history.push(`/voting/${project.projectCid}`);
  };

  // const { result: totalHolder } = useTokenTotalHolder(project.tokenCid);

  return (
    <MainCard level={4}>
      <Grid container justifyContent="center" mb="20px">
        <Avatar src={project.logo} sx={{ marginRight: "12px", width: "100px", height: "100px" }}>
          &nbsp;
        </Avatar>
      </Grid>
      <Box mt="20px">
        <Typography color="text.primary" fontSize="24px" fontWeight={500} align="center">
          {project.name}
        </Typography>
      </Box>
      {/* <Box mt="10px">
        <Typography fontSize="14px" align="center">
          {totalHolder !== undefined ? formatAmount(Number(totalHolder), 0) : "--"} holders
        </Typography>
      </Box> */}
      <Grid container justifyContent="center" mt="40px" mb="20px">
        <Box
          sx={{
            border: `1px solid ${theme.colors.darkSecondaryMain}`,
            borderRadius: "300px",
            padding: "14px 50px",
            cursor: "pointer",
            "&:hover": {
              background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
              border: "1px solid transparent",
            },
          }}
          onClick={handleEnter}
        >
          <Typography color="text.primary" fontSize="14px" fontWeight={500} component="span">
            <Trans>Enter</Trans>
          </Typography>
        </Box>
      </Grid>
    </MainCard>
  );
}

export default function Voting() {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const { result, loading } = useVotingProjects(offset, pagination.pageSize);
  const { content: list, totalElements } = result ?? { content: [] as ProjectInfo[], totalElements: BigInt(0) };

  const matchDown1160 = useMediaQuery("(max-width:1160px)");
  const matchDown760 = useMediaQuery("(max-width:760px)");
  const matchDown640 = useMediaQuery("(max-width:640px)");

  return (
    <Wrapper>
      <MainCard>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h3">
              <Trans>Voting</Trans>
            </Typography>
          </Grid>
        </Grid>

        <Box mt="20px" sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: matchDown640
                ? "1fr"
                : matchDown760
                ? "repeat(2, 1fr)"
                : matchDown1160
                ? "repeat(3, 1fr)"
                : "repeat(4, 1fr)",
              gap: "20px 20px",
              ...(loading ? { minHeight: "300px" } : {}),
            }}
          >
            {list.map((ele) => (
              <VoteItem key={ele.tokenCid} project={ele} />
            ))}
          </Box>

          {loading ? (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                top: "0",
                left: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StaticLoading loading={loading} />
            </Box>
          ) : null}

          {list.length === 0 && !loading ? <NoData /> : null}
        </Box>

        {Number(totalElements) > 0 ? (
          <Pagination
            count={Number(totalElements)}
            defaultPageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        ) : null}
      </MainCard>
    </Wrapper>
  );
}
