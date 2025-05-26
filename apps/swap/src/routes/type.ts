import { ReactNode } from "react";

interface RouterConfig {
  browserRouterEnabled?: boolean;
  hash?: string;
  isEmbeddedWalletEnabled?: boolean;
}

export interface RouteDefinition {
  path: string;
  nestedPaths?: string[];
  getTitle?: (path?: string) => string;
  getDescription?: (path?: string) => string;
  enabled?: (args: RouterConfig) => boolean;
  getElement: (args: RouterConfig) => ReactNode;
}
