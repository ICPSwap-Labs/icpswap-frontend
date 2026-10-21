import { MAX_NUMBER, routes } from "./config";
import { ExceedRoutes } from "./ExceedRoutes";
import { Routes } from "./Routes";

export default function NavBar() {
  return (
    <nav className="flex h-full items-center gap-1" aria-label="ICPSwap">
      <Routes routes={routes} />
      {routes.length > MAX_NUMBER ? <ExceedRoutes routes={routes} /> : null}
    </nav>
  );
}
