import { TabPanel } from "components/index";

export function Tabs() {
  const tabs = [
    { key: "neurons", value: "Neurons", path: "/sns/neurons" },
    { key: "voting", value: "Voting", path: "/sns/voting" },
    { key: "launchpad", value: "Launches", path: "/sns/launches" },
  ];

  return <TabPanel tabs={tabs} />;
}
