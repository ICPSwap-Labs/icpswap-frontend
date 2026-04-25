import { LinearLoader } from "@icpswap/ui";
import type React from "react";
import { Suspense } from "react";

export default function Loadable(Component: React.FC) {
  return (props: any) => (
    <Suspense fallback={<LinearLoader />}>
      <Component {...props} />
    </Suspense>
  );
}
