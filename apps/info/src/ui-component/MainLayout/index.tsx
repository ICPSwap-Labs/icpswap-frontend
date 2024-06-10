import { ReactNode, useState } from "react";
import { makeStyles } from "@mui/styles";
import { CssBaseline } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { GlobalTips } from "@icpswap/ui";
import Header from "./Header";
import NavBar from "./NavBar/index";

const useStyles = makeStyles((theme: Theme) => {
  return {
    content: {
      backgroundColor: theme.palette.background.level1,
      width: "100%",
      minHeight: "calc(100vh - 160px)", // 100 + 60
      borderRadius: "8px",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      [theme.breakpoints.down("sm")]: {
        padding: "0px",
        backgroundColor: "transparent",
      },
    },
  };
});

export default function MainLayout({ children }: { children: ReactNode }) {
  const classes = useStyles();

  const [globalTipsOpen, setGlobalTipsOpen] = useState(true);

  return (
    <div>
      <CssBaseline />

      <Header />

      {globalTipsOpen ? <GlobalTips onClose={() => setGlobalTipsOpen(false)} /> : null}

      <NavBar />

      <main className={classes.content}>{children}</main>
    </div>
  );
}
