import { ReactNode } from "react";
import ExternalLink from "./index";
import { getExplorerPrincipalLink } from "utils";

export default function ExplorerExternalLink({ label, value }: { label: ReactNode; value: string }) {
  return <ExternalLink value={getExplorerPrincipalLink(value)} label={label} />;
}
