import { Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { MainCard, TabPanel, type Tab } from "components/index";
import { Theme } from "@mui/material/styles";

export interface MainContentProps {
  children: React.ReactNode;
  buttons: { key: string; value: string }[];
  onChange: (button: Tab) => void;
  active: string;
}

export function MainContent({ children, buttons, onChange, active }: MainContentProps) {
  const theme = useTheme() as Theme;

  return (
    <MainCard
      level={1}
      sx={{
        padding: "32px",
        "@media(max-width: 980px)": {
          padding: "16px",
        },
      }}
    >
      <TabPanel
        tabs={buttons}
        onChange={onChange}
        active={active}
        bg0={theme.palette.background.level3}
        bg1={theme.palette.background.level1}
        fullWidth
        fontSize="16px"
        fontNormal
      />

      <Box sx={{ margin: "32px 0 0 0" }}>{children}</Box>
    </MainCard>
  );
}
