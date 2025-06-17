import { useParsedQueryString } from "@icpswap/hooks";
import { TabPanel } from "components/index";
import { useMemo } from "react";

export function Tabs() {
  const { root_id } = useParsedQueryString() as { root_id: string };

  const tabs = useMemo(() => {
    return [
      { key: "neurons", value: "Neurons", path: `/sns/neurons?root_id=${root_id}` },
      { key: "voting", value: "Voting", path: `/sns/voting?root_id=${root_id}` },
      { key: "launches", value: "Launchpad", path: "/sns/launches" },
    ];
  }, [root_id]);

  return <TabPanel tabs={tabs} />;
}
