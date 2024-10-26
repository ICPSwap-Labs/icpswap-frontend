import { useMemo } from "react";
import { Select, AvatarImage } from "components/index";
import { Box, Typography } from "@mui/material";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { SnsSwapLifecycle } from "@icpswap/constants";

export interface SelectSnsProps {
  onChange: (value: string) => void;
  value: string | null;
}

export function SelectSns({ onChange, value }: SelectSnsProps) {
  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();

  const completedSns = useMemo(() => {
    if (!snsAllTokensInfo) return undefined;
    return snsAllTokensInfo.filter((e) => e.lifecycle.lifecycle === SnsSwapLifecycle.Committed);
  }, [snsAllTokensInfo]);

  const menus = useMemo(() => {
    if (!completedSns) return [];
    return completedSns?.map((e) => ({
      value: e.canister_ids.root_canister_id,
      label: (
        <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
          <AvatarImage src={e.meta.logo} sx={{ width: "24px", height: "24px" }} />
          <Typography fontWeight={500}>{e.meta.name}</Typography>
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
