import type { Null } from "@icpswap/types";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Link } from "components/index";
import { useTokenImportToNns } from "hooks/token";
import type { ReactNode } from "react";
import { importTokenToNnsUrl } from "utils/ic";

interface ImportToNnsProps {
  tokenId: string | Null;
  children: ReactNode;
}

export function ImportToNns({ tokenId, children }: ImportToNnsProps) {
  const canImportToNns = useTokenImportToNns(tokenId);

  return canImportToNns && nonUndefinedOrNull(tokenId) ? (
    <Link link={importTokenToNnsUrl(tokenId)}>{children}</Link>
  ) : null;
}
