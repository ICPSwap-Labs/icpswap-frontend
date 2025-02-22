import { useState, useEffect } from "react";
import { Grid, Typography, Box, useTheme, useMediaQuery, makeStyles, Theme } from "components/Mui";
import { RISK_WARNING_INDEX } from "constants/zIndex";
import { useTranslation } from "react-i18next";

import RiskStatementModal, { getRiskStorage } from "./Modal";

const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      padding: "15px 20px",
      background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
      [theme.breakpoints.down("md")]: {
        padding: "5px 10px",
      },
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "40px",
      padding: "0 20px",
      background: "#FFFFFF",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      cursor: "pointer",
      [theme.breakpoints.down("md")]: {
        height: "30px",
        padding: "0 10px",
      },
      [theme.breakpoints.down("sm")]: {
        marginTop: "8px",
      },
    },
  };
});

export default function RiskStatement() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const [riskStatementShow, setRickStatementShow] = useState(false);
  const [isRead, setIsRead] = useState(true);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      const isRead = await getRiskStorage();
      if (isRead === "true" || isRead === true) {
        setIsRead(true);
      } else {
        setIsRead(false);
      }
    })();
  }, []);

  const handleRead = () => {
    setRickStatementShow(true);
  };

  return !isRead ? (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: RISK_WARNING_INDEX,
        }}
      >
        <Grid
          flexDirection={matchDownSM ? "column" : "row"}
          container
          alignItems="center"
          className={classes.container}
        >
          <Grid item xs>
            <Typography color="text.primary" fontSize={matchDownSM ? "12px" : "14px"} lineHeight="20px">
              {t("risk.description0")}
            </Typography>
          </Grid>
          <Box className={classes.button} onClick={handleRead}>
            <Typography color="secondary" fontWeight="500" fontSize={matchDownSM ? "12px" : "14px"}>
              {t("risk.read.close")}
            </Typography>
          </Box>
        </Grid>
      </Box>

      {riskStatementShow ? (
        <RiskStatementModal
          open={riskStatementShow}
          onClose={() => setRickStatementShow(false)}
          onRead={() => setIsRead(true)}
        />
      ) : null}
    </>
  ) : null;
}
