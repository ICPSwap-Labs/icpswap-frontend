import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, Avatar, Box, useTheme } from "components/Mui";
import { pageArgsFormat } from "@icpswap/utils";
import { Wrapper, MainCard, Pagination, PaginationType, NoData, ImageLoading } from "components/index";
import { ProjectInfo } from "@icpswap/types";
import { useVotingProjects } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";
import { useMediaQuery1160, useMediaQuery640, useMediaQuery760 } from "hooks/theme";

export interface VoteItemProps {
  project: ProjectInfo;
}

export function VoteItem({ project }: VoteItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();

  const handleEnter = () => {
    history.push(`/voting/${project.projectCid}`);
  };

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
            {t("common.enter")}
          </Typography>
        </Box>
      </Grid>
    </MainCard>
  );
}

export default function Voting() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const { result, loading } = useVotingProjects(offset, pagination.pageSize);
  const { content: list, totalElements } = result ?? { content: [] as ProjectInfo[], totalElements: BigInt(0) };

  const down1160 = useMediaQuery1160();
  const down760 = useMediaQuery760();
  const down640 = useMediaQuery640();

  return (
    <Wrapper>
      <MainCard>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h3">{t("voting")}</Typography>
          </Grid>
        </Grid>

        <Box mt="20px" sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: down640
                ? "1fr"
                : down760
                ? "repeat(2, 1fr)"
                : down1160
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
              <ImageLoading loading={loading} />
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
