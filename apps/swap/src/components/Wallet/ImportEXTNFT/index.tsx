import { useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import { ImportNFTCanisterModal } from "./Modal";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    borderRadius: "8px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
}));

export function ImportEXTNft() {
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        size={matchDownSM ? "medium" : "large"}
        startIcon={<AddIcon />}
        onClick={() => setModalVisible(true)}
        className={classes.button}
      >
        <Trans>Import NFT</Trans>
      </Button>

      {modalVisible && <ImportNFTCanisterModal open={modalVisible} onClose={() => setModalVisible(false)} />}
    </>
  );
}
