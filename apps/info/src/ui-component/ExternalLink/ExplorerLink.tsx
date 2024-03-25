import { ReactNode } from "react";
import { getExplorerPrincipalLink } from "utils";
import ExternalLink from "./index";

export default function ExplorerExternalLink({ label, value }: { label: ReactNode; value: string }) {
  return <ExternalLink value={getExplorerPrincipalLink(value)} label={label} />;
}
