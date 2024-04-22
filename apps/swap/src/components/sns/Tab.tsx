import { TabPanel } from "components/index";

export function Tabs() {
  const tabs = [
    { key: "neurons", value: "Neurons", path: "/sns/neurons" },
    { key: "voting", value: "Voting", path: "/sns/voting" },
    { key: "launches", value: "Launchpad", path: "/sns/launches" },
  ];

  return <TabPanel tabs={tabs} />;
}
