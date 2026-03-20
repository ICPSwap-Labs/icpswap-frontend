import { icDashboardExplorerLink } from "@icpswap/utils";
import type { ReactNode } from "react";

import ExternalLink from "./index";

export default function ExplorerLink({ label, value }: { label: ReactNode; value: string }) {
  return <ExternalLink value={icDashboardExplorerLink(value)} label={label} />;
}
