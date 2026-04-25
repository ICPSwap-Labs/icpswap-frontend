/**
 * @link https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/utils/useEventCallback.js
 */

// @ts-nocheck

import * as React from "react";

const useEnhancedEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export default function useEventCallback(fn) {
  const ref = React.useRef(fn);

  useEnhancedEffect(() => {
    ref.current = fn;
  });

  // oxlint-disable-next-line react-hooks/exhaustive-deps -- stable callback via ref; empty deps intentional
  return React.useCallback((...args) => (0, ref.current)(...args), []);
}
