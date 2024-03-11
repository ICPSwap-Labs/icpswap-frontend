import React, { Suspense } from "react";
import Loader from "./LinearLoader";

export default function Loadable(Component: React.FC) {
  return (props: any) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
}
