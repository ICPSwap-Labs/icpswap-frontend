import { nonUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useTokenImportToNns } from "hooks/token";
import { ReactNode } from "react";
import { Link } from "components/index";
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
