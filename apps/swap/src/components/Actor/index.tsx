import { useHandleActorError } from "hooks/useActorError";
import { useActorSubmit } from "hooks/useActorSubmit";
import React from "react";

export default function Actor({ children }: { children: React.ReactNode }) {
  useHandleActorError();
  useActorSubmit();

  return <>{children}</>;
}
