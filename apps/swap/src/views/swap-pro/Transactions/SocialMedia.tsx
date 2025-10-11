/* eslint-disable react/no-danger */

import { Box, Typography, useTheme } from "components/Mui";
import { LoadingRow, Flex, NoData, SimplePagination } from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useSwapProContext } from "components/swap/pro";
import { SocialMediaResult } from "@icpswap/types";
import dayjs from "dayjs";
import { sanitize } from "utils/html";
import { useTokenSocialMedias } from "hooks/useTokenSocialMedia";
import { useMemo, useState } from "react";

const MAX_ITEMS = 10;

interface TokenNewsItemProps {
  tokenNews: SocialMediaResult;
}

function TokenNewsItem({ tokenNews }: TokenNewsItemProps) {
  const theme = useTheme();

  return (
    <Box sx={{ padding: "16px", borderBottom: `1px solid ${theme.palette.background.level1}` }}>
      <Typography
        sx={{
          color: "text.primary",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: 1.6,
          "& a": { color: theme.colors.secondaryMain },
        }}
        component="div"
      >
        <div dangerouslySetInnerHTML={{ __html: sanitize(tokenNews.title) }} />
      </Typography>
      <Typography sx={{ fontSize: "12px", margin: "8px 0 0 0" }}>
        {dayjs(Number(tokenNews.created_at)).format("YYYY-MM-DD hh:mm:ss")}
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          color: "text.primary",
          lineHeight: "20px",
          margin: "12px 0 0 0",
          "& a": { color: theme.colors.secondaryMain },
        }}
        component="div"
      >
        <div dangerouslySetInnerHTML={{ __html: sanitize(tokenNews.content) }} />
      </Typography>
    </Box>
  );
}

export function SocialMedia() {
  const { token } = useSwapProContext();
  const { result: tokenNews, loading } = useTokenSocialMedias(token?.address);

  const [page, setPage] = useState(1);

  const sliceResult = useMemo(() => {
    if (isUndefinedOrNull(tokenNews)) return [];

    return tokenNews.slice(MAX_ITEMS * (page - 1), page * MAX_ITEMS);
  }, [page, tokenNews]);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Flex fullWidth vertical align="flex-start" gap="16px 0">
        {loading ? (
          <Box sx={{ width: "100%", padding: "24px" }}>
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
        ) : isUndefinedOrNull(tokenNews) || tokenNews.length === 0 ? (
          <Flex fullWidth justify="center">
            <NoData />
          </Flex>
        ) : (
          <>
            {sliceResult.map((news, index) => (
              <TokenNewsItem key={index} tokenNews={news} />
            ))}

            <Box mb="20px" sx={{ width: "100%" }}>
              <SimplePagination page={page} maxItems={MAX_ITEMS} length={tokenNews.length} onPageChange={setPage} />
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
}
