import { useMemo } from "react";
import { Select, AvatarImage } from "components/index";
import { useSNSTokensRootIds } from "@icpswap/hooks";
import { Box, Typography } from "@mui/material";

export interface SelectSnsProps {
  onChange: (value: string) => void;
  value: string | null;
}

export function SelectSns({ onChange, value }: SelectSnsProps) {
  const { result: snsTokens } = useSNSTokensRootIds();

  const completedSns = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.filter((e) => e.swap_lifecycle.lifecycle === "LIFECYCLE_COMMITTED");
  }, [snsTokens]);

  const menus = useMemo(() => {
    if (!completedSns) return [];
    return completedSns?.map((e) => ({
      value: e.root_canister_id,
      label: (
        <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
          <AvatarImage src={e.logo} sx={{ width: "24px", height: "24px" }} />
          <Typography fontWeight={500}>{e.name}</Typography>
        </Box>
      ),
    }));
  }, [completedSns]);

  const handleSelectChange = (value: string) => {
    onChange(value);
  };

  return (
    <Box sx={{ width: "420px" }}>
      <Select value={value} menus={menus} onChange={handleSelectChange} />
    </Box>
  );
}
