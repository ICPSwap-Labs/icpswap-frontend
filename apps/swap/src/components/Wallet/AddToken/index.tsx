import { useState } from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import AddTokenModal from "./modal";
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

export default function AddToken() {
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setModalVisible(true)}
        className={classes.button}
      >
        <Trans>Add Token</Trans>
      </Button>
      {modalVisible ? <AddTokenModal open={modalVisible} onClose={() => setModalVisible(false)} /> : null}
    </>
  );
}
