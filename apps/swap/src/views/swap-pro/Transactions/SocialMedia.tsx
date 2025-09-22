/* eslint-disable react/no-danger */

import { Box, Typography, useTheme } from "components/Mui";
import { useTokenNews } from "@icpswap/hooks";
import { LoadingRow, Flex, NoData } from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useSwapProContext } from "components/swap/pro";
import { SocialMediaResult } from "@icpswap/types";
import dayjs from "dayjs";
import { sanitize } from "utils/html";

interface TokenNewsItemProps {
  tokenNews: SocialMediaResult;
}

function TokenNewsItem({ tokenNews }: TokenNewsItemProps) {
  const theme = useTheme();

  return (
    <Box sx={{ padding: "16px", borderBottom: `1px solid ${theme.palette.background.level1}` }}>
      <Typography
        sx={{ color: "text.primary", fontWeight: 600, fontSize: "16px", "& a": { color: theme.colors.secondaryMain } }}
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
      >
        <div dangerouslySetInnerHTML={{ __html: sanitize(tokenNews.content) }} />
      </Typography>
    </Box>
  );
}

export function SocialMedia() {
  const { token } = useSwapProContext();
  const { result: tokenNews, loading } = useTokenNews(token?.symbol, 0, 100);

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
          tokenNews.map((news, index) => <TokenNewsItem key={index} tokenNews={news} />)
        )}
      </Flex>
    </Box>
  );
}
