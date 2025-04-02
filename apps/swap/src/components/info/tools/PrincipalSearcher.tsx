import { Box, Typography, useTheme } from "components/Mui";
import { isValidPrincipal } from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { Flex } from "@icpswap/ui";
import { FilledTextField } from "components/index";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";

interface PrincipalSearcherProps {
  onPrincipalChange: (principal: string | Null) => void;
  placeholder?: string;
}

export function PrincipalSearcher({ onPrincipalChange, placeholder }: PrincipalSearcherProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { principal } = useParsedQueryString() as { pair: string | undefined; principal: string | undefined };

  return (
    <Flex
      gap="2px 12px"
      sx={{
        "@media(max-width: 640px)": {
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
        },
      }}
    >
      <Box
        sx={{
          width: "343px",
          height: "40px",
          "@media(max-width: 640px)": {
            width: "100%",
          },
        }}
      >
        <FilledTextField
          width="100%"
          fullHeight
          value={principal}
          textFieldProps={{
            slotProps: {
              input: {
                placeholder: placeholder ?? `Search the principal`,
              },
            },
          }}
          placeholderSize="12px"
          onChange={onPrincipalChange}
          background={theme.palette.background.level1}
        />
      </Box>
      {principal && !isValidPrincipal(principal) ? (
        <Typography sx={{ margin: "3px 0 0 2px", fontSize: "12px" }} color="error.main">
          {t("common.invalid.principal.id")}
        </Typography>
      ) : null}
    </Flex>
  );
}
