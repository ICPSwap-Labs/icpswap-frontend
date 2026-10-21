import { useParsedQueryString } from "@icpswap/hooks";
import { TabPanel } from "components/index";
import { DEFAULT_ROOT_ID } from "constants/nns";
import { useMemo } from "react";

export function Tabs() {
  const { root_id } = useParsedQueryString() as { root_id: string };

  const tabs = useMemo(() => {
    const __root_id = root_id ?? DEFAULT_ROOT_ID;

    return [
      { key: "neurons", value: "Neurons", path: `/sns/neurons?root_id=${__root_id}` },
      { key: "voting", value: "Voting", path: `/sns/voting?root_id=${__root_id}` },
      { key: "launches", value: "Launchpad", path: "/sns/launches" },
    ];
  }, [root_id]);

  return (
    <div className="border-b border-base-300 pb-6">
      <TabPanel
        tabs={tabs}
        bg0="var(--color-base-200)"
        bg1="color-mix(in oklab, var(--color-primary) 14%, var(--color-base-100))"
        borderRadius="10px"
        padding0="5px"
        padding1="0 24px"
      />
    </div>
  );
}
