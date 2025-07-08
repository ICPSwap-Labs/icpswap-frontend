import { useMemo } from "react";
import { Select, AvatarImage } from "components/index";
import { Box, Typography } from "components/Mui";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";
import { getNnsRootId, isNnsCommitted, nnsTokenLogo } from "utils/sns/utils";

export interface SelectSnsProps {
  onChange: (value: string) => void;
  value: string | null;
}

export function SelectSns({ onChange, value }: SelectSnsProps) {
  const snsAllTokensInfo = useStateSnsAllTokensInfo();

  const completedSns = useMemo(() => {
    if (!snsAllTokensInfo) return undefined;
    return snsAllTokensInfo.filter((nns) => isNnsCommitted(nns));
  }, [snsAllTokensInfo]);

  const menus = useMemo(() => {
    if (!completedSns) return [];
    return completedSns?.map((nns) => ({
      value: getNnsRootId(nns),
      label: (
        <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
          <AvatarImage src={nnsTokenLogo(nns)} sx={{ width: "24px", height: "24px" }} />
          <Typography fontWeight={500}>{nns.meta.name}</Typography>
        </Box>
      ),
    }));
  }, [completedSns]);

  const handleSelectChange = (value: string) => {
    onChange(value);
  };

  return (
    <Box
      sx={{
        width: "420px",
        "@media(max-width: 640px)": {
          width: "100%",
        },
      }}
    >
      <Select value={value} menus={menus} onChange={handleSelectChange} />
    </Box>
  );
}
