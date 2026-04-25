import type React from "react";
import { useEffect, useState } from "react";

export interface DisableIframeProps {
  children: React.ReactElement;
}

export function DisableIframe({ children }: DisableIframeProps) {
  const [sameOrigin, setSameOrigin] = useState(true);

  useEffect(() => {
    if (top?.location !== self.location) {
      setSameOrigin(false);
    }
  }, []);

  return sameOrigin ? children : <div>Not support iframe now</div>;
}
