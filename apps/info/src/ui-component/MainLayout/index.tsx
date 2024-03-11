import { ReactNode, useState } from "react";
import { makeStyles } from "@mui/styles";
import { CssBaseline } from "@mui/material";
import Header from "./Header";
import NavBar from "./NavBar/index";
import { Theme } from "@mui/material/styles";
import UpgradeEvent from "ui-component/UpgradeEvent";

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

  const [upgradeShow, setUpgradeShow] = useState(false);

  return (
    <div>
      <CssBaseline />

      <Header />

      {upgradeShow ? <UpgradeEvent onClick={() => setUpgradeShow(false)} /> : null}

      <NavBar />

      <main className={classes.content}>{children}</main>
    </div>
  );
}
