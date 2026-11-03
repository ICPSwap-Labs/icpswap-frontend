import { useDesignVersion } from "hooks/useDesignVersion";

import { MAX_NUMBER, routes } from "./config";
import { ExceedRoutes } from "./ExceedRoutes";
import { Routes } from "./Routes";

export default function NavBar() {
  const { isClassicDesign } = useDesignVersion();
  return (
    <nav
      className={
        isClassicDesign
          ? "ics-classic-nav flex items-center gap-2 max-[1200px]:gap-0"
          : "ics-terminal-nav flex w-full flex-col gap-2"
      }
      aria-label="ICPSwap"
    >
      <Routes routes={routes} />
      {routes.length > MAX_NUMBER ? <ExceedRoutes routes={routes} /> : null}
    </nav>
  );
}
