/// <reference types="react-scripts" />

interface Window {
  ic: {
    plug: any;
  };
  icConnector?: any;
}

declare module "react/jsx-runtime" {
  export default any;
}

declare module "@mui/material/styles" {
  interface Theme {
    direction: string;
    palette: any;
    mixins: {
      toolbar: any;
      overflowEllipsis: any;
      overflowEllipsis2: any;
    };
    customShadows: any;
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
  }

  interface ThemeOptions {
    direction?: string;
    palette?: any;
    mixins?: {
      toolbar: any;
      overflowEllipsis: any;
      overflowEllipsis2: any;
    };
    customShadows?: any;
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
