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

declare module "@mui/material/styles" {
  interface Theme {
    direction: string;
    palette: any;
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
}
