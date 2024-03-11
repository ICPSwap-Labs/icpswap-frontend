/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  const src: string;
  export default src;
}

type DelegationMode = "global" | "domain";

interface WebViewConnectRequest {
  delegationTargets?: Array<string>;
  noUnify?: boolean;
  host: string;
  customDomain?: string;
  delegationModes?: Array<DelegationMode>;
}

interface CreateActorArgs {
  canisterId: string;
  interfaceFactory: IDL.interfaceFactory;
}

interface Window {
  ic: {
    plug: {
      createAgent: ({ whitelist, host }: { whitelist: string[]; host: string }) => Promise<boolean>;
      agent: HttpAgent;
      requestConnect: ({ whitelist }: { whitelist?: string[] }) => Promise<any>;
      fetchRootKey: () => Promise<void>;
      createActor: <T>({ canisterId, interfaceFactory }: CreateActorArgs) => Promise<ActorSubclass<T>>;
      isConnected: () => Promise<boolean>;
      disconnect: () => Promise<void>;
      principalId: string;
      getPrincipal: () => Promise<Principal>;
    };
    infinityWallet: {
      requestConnect: ({ whitelist }: { whitelist?: string[] }) => Promise<any>;
      createActor: <T>({ canisterId, interfaceFactory }: CreateActorArgs) => Promise<ActorSubclass<T>>;
      isConnected: () => Promise<boolean>;
      disconnect: () => Promise<void>;
      getPrincipal: () => Promise<Principal>;
    };
  };
  icx: {
    identity: Identity;
    address: () => { principal?: string; accountId?: string };
    init: () => Promise<void>;
    connect: (args: WebViewConnectRequest) => Promise<boolean>;
    reconnect: (args: WebViewConnectRequest) => Promise<boolean>;
    isConnected: () => Promise<boolean>;
    disconnect: () => Promise<boolean>;
    createActor: <T>(canisterId: string, interfaceFactory: IDL.interfaceFactory) => Promise<ActorSubclass<T>>;
  };
  astrox_webview: any;
  icConnector: {
    getPrincipal: string | undefined;
    createActor: <T>({ canisterId, interfaceFactory }: CreateActorArgs) => Promise<ActorSubclass<T>>;
    isConnected: () => Promise<boolean>;
    disconnect: () => Promise<void>;
  };
}

declare module "@mui/material/styles" {
  interface Theme {
    direction: string;
    palette: any;
    mixins: {
      overflowEllipsis: any;
      overflowEllipsis2: any;
    };
    typography: any;
    components: any;
    themeOption: any;
    colors: any;
    fontSize: any;
    customization: any;
    radius: number;
    breakpoints: any;
    spacing: (sp: number) => string;
    shadows: string[];
    transitions: any;
    textPrimary: string;
  }

  interface ThemeOptions {
    direction?: string;
    palette?: any;
    mixins?: {
      overflowEllipsis: any;
      overflowEllipsis2: any;
    };
    typography?: any;
    components?: any;
    themeOption?: any;
    colors?: any;
    fontSize?: any;
    customization?: any;
    radius?: number;
    breakpoints?: any;
  }

  function createTheme(themeOptions: ThemeOptions): Theme;

  function ThemeProvider<T = DefaultTheme>(props: ThemeProviderProps<T>): React.ReactElement<ThemeProviderProps<T>>;
}
