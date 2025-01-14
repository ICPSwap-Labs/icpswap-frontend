import { ReactNode } from "react";
import { explorerLink } from "@icpswap/utils";

import ExternalLink from "./index";

export default function ExplorerLink({ label, value }: { label: ReactNode; value: string }) {
  return <ExternalLink value={explorerLink(value)} label={label} />;
}
