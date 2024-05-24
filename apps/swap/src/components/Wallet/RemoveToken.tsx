import { useState, useRef } from "react";
import { Typography, Box, Popper } from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { Modal } from "components/index";

const useStyles = makeStyles(() => ({
  dot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#8492C4",
  },
}));

export interface TokenListItemProps {
  canisterId: string;
}

export function RemoveToken({ canisterId }: TokenListItemProps) {
  const classes = useStyles();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { deleteTaggedTokens } = useTaggedTokenManager();

  const handleConfirm = () => {
    deleteTaggedTokens([canisterId]);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleRemoveToken = () => {
    setModalOpen(true);
  };

  return (
    <Box ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ height: "32px" }}>
      <Box sx={{ display: "flex", gap: "0 4px", height: "32px", alignItems: "center", cursor: "pointer" }}>
        <Box className={classes.dot} />
        <Box className={classes.dot} />
        <Box className={classes.dot} />
      </Box>

      <Popper
        open={open}
        anchorEl={ref?.current}
        placement="bottom"
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [26, 0],
              },
            },
          ],
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box
            sx={{
              background: "#ffffff",
              padding: "10px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={handleRemoveToken}
          >
            {/* <Box
              sx={{
                borderBottom: "6px solid #ffffff ",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                position: "absolute",
                top: "-6px",
                left: "20px",
              }}
            /> */}
            <Typography color="#111936" sx={{ fontSize: "12px" }}>
              <Trans>Remove Token</Trans>
            </Typography>
          </Box>
        </ClickAwayListener>
      </Popper>

      <Modal
        title={t`Remove Token`}
        open={modalOpen}
        showCancel
        showConfirm
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={handleCancel}
      >
        <Typography sx={{ padding: "0 0 30px 0" }}>
          <Trans>
            Are you sure you want to remove the token? After you remove the token, you can add it again. Please be
            assured that the token will not be lost.
          </Trans>
        </Typography>
      </Modal>
    </Box>
  );
}
