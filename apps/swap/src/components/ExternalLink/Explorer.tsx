import { ReactNode } from "react";
import { icDashboardExplorerLink } from "@icpswap/utils";

import ExternalLink from "./index";

export default function ExplorerLink({ label, value }: { label: ReactNode; value: string }) {
  return <ExternalLink value={icDashboardExplorerLink(value)} label={label} />;
}
