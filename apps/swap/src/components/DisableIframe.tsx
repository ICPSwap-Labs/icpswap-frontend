import React, { useEffect, useState } from "react";

export interface DisableIframeProps {
  children: React.ReactNode;
}

export function DisableIframe({ children }: DisableIframeProps) {
  const [sameOrigin, setSameOrigin] = useState(true);

  useEffect(() => {
    if (top?.location !== self.location) {
      setSameOrigin(false);
    }
  }, [setSameOrigin]);

  return sameOrigin ? <>{children}</> : <div>Not support iframe now</div>;
}
