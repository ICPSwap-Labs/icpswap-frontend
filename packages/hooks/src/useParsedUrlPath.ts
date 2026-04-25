import { urlStringParse } from "@icpswap/utils";
import { useMemo } from "react";

import { useParsedQueryString } from "./useParsedQueryString";

export function useParsedUrlPath() {
  const { path, label } = useParsedQueryString() as { path: string | undefined; label: string | undefined };

  return useMemo(
    () => ({
      path: path ? urlStringParse(path) : undefined,
      label: label ? urlStringParse(label) : undefined,
    }),
    [path, label],
  );
}
