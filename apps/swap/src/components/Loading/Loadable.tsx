import React, { Suspense } from "react";
import { LinearLoader } from "@icpswap/ui";

export default function Loadable(Component: React.FC) {
  return (props: any) => (
    <Suspense fallback={<LinearLoader />}>
      <Component {...props} />
    </Suspense>
  );
}
