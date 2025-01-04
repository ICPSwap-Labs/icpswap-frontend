import { Null } from "@icpswap/types";
import qs from "qs";

export function locationSearchReplace(search: string, key: string, value: string | Null) {
  return locationMultipleSearchReplace(search, [{ key, value }]);
}

interface Params {
  key: string;
  value: string | Null;
}

export function locationMultipleSearchReplace(search: string, params: Params[]) {
  const __search = search.replace("?", "");
  const parsedSearch = qs.parse(__search);

  params.forEach(({ key, value }) => {
    if (value) {
      parsedSearch[key] = value;
    } else {
      Reflect.deleteProperty(parsedSearch, key);
    }
  });

  return `?${qs.stringify(parsedSearch)}`;
}
