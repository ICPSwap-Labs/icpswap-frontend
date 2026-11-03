import LogoSection from "components/LogoSection";
import { EcosystemIllustration } from "./EcosystemIllustration";
import Navbar from "./Navbar";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      id="ics-desktop-sidebar"
      className={`ics-terminal-sidebar border-r border-base-content/10 bg-base-100 text-base-content${collapsed ? " is-collapsed" : ""}`}
    >
      <div
        className={`flex h-24 shrink-0 items-center border-b border-base-content/10 ${collapsed ? "justify-center" : "px-6"}`}
      >
        <LogoSection iconOnly={collapsed} />
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto py-7 ${collapsed ? "px-3" : "px-4"}`}>
        <Navbar />
      </div>

      <div
        className={`pointer-events-none relative mx-6 mb-6 h-40 shrink-0 overflow-hidden border-t border-base-content/10 pt-5${collapsed ? " hidden" : ""}`}
        aria-hidden="true"
      >
        <EcosystemIllustration />
      </div>
    </aside>
  );
}
