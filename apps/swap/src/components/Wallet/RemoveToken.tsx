import { useState, useRef } from "react";
import { Typography, Box, Popper, makeStyles } from "components/Mui";
import { ClickAwayListener } from "@mui/base";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { Modal } from "components/index";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
            <Typography color="#111936" sx={{ fontSize: "12px" }}>
              {t("common.remove.token")}
            </Typography>
          </Box>
        </ClickAwayListener>
      </Popper>

      <Modal
        title={t("common.remove.token")}
        open={modalOpen}
        showCancel
        showConfirm
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={handleCancel}
      >
        <Typography sx={{ padding: "0 0 30px 0" }}>{t("wallet.remove.token.confirms")}</Typography>
      </Modal>
    </Box>
  );
}
