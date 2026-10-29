import { useDesignVersion } from "hooks/useDesignVersion";
import { useParsedQueryString } from "@icpswap/hooks";
import { TabPanel } from "components/index";
import { Box } from "components/Mui";
import { DEFAULT_ROOT_ID } from "constants/nns";
import { useMemo } from "react";

export function Tabs() {
  const { isClassicDesign } = useDesignVersion();

  const { root_id } = useParsedQueryString() as { root_id: string };

  const tabs = useMemo(() => {
    const __root_id = root_id ?? DEFAULT_ROOT_ID;

    return [
      { key: "neurons", value: "Neurons", path: `/sns/neurons?root_id=${__root_id}` },
      { key: "voting", value: "Voting", path: `/sns/voting?root_id=${__root_id}` },
      { key: "launches", value: "Launchpad", path: "/sns/launches" },
    ];
  }, [root_id]);

  if (isClassicDesign) {
    return <TabPanel tabs={tabs} />;
  }

  return (
    <Box
      className="border-b border-base-300"
      sx={{
        "& .MuiGrid-root": { justifyContent: "flex-start" },
        "& .active.active": { color: "var(--color-primary)", boxShadow: "inset 0 -2px 0 var(--color-primary)" },
        "& .MuiGrid-root > .MuiBox-root > .MuiBox-root": { height: "56px" },
      }}
    >
      <TabPanel tabs={tabs} bg0="transparent" bg1="transparent" borderRadius="0" padding0="0" padding1="0 28px" />
    </Box>
  );
}
