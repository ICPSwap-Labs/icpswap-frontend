import { useState } from "react";
import { Typography, Box, Checkbox, Button, makeStyles, useTheme, Theme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { TextButton, Modal } from "components/index";
import storage from "redux-persist/lib/storage";
import { Trans, useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => {
  return {
    content: {
      background: theme.palette.background.level3,
      border: `1px solid ${theme.palette.background.level4}`,
      borderRadius: "12px",
      padding: "14px 16px",
      marginTop: "16px",
      overflow: "auto",
      maxHeight: "280px",
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
    },
  };
});

export const RISK_STORAGE_NAME = "ICPSwap_Risk";

export async function getRiskStorage() {
  const storageRisk = await storage.getItem(RISK_STORAGE_NAME);
  const isRead = !storageRisk ? "" : JSON.parse(storageRisk);
  return isRead;
}

export async function setRiskStorage(isRead: boolean) {
  await storage.setItem(RISK_STORAGE_NAME, JSON.stringify(isRead));
}

interface RiskStatementModalProps {
  open: boolean;
  onClose: () => void;
  onRead: () => void;
}

export default function RiskStatementModal({ open, onClose, onRead }: RiskStatementModalProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [isRead, setIsRead] = useState(false);

  const theme = useTheme() as Theme;

  const handleRead = () => {
    setRiskStorage(true);
    onClose();
    onRead();
  };

  return (
    <Modal
      title={t("risk.warning")}
      open={open}
      onClose={onClose}
      type="warning"
      dialogProps={{
        sx: {
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.background.level1,
          },
        },
      }}
    >
      <Box>
        <Typography sx={{ lineHeight: "20px" }}>{t("risk.description0")}</Typography>
      </Box>
      <Box className={classes.content}>
        <Box>
          <Typography sx={{ lineHeight: "20px" }}>{t("risk.description1")}</Typography>
        </Box>
        <Box mt="30px">
          <Typography sx={{ lineHeight: "20px" }}>{t("risk.description2")}</Typography>
        </Box>
        <Box mt="30px">
          <Typography sx={{ lineHeight: "20px" }}>{t("risk.description3")}</Typography>
        </Box>
        <Box mt="30px">
          <Typography sx={{ lineHeight: "20px" }}>
            <Trans
              components={{ highlight: <Typography color="primary" component="span" /> }}
              i18nKey="risk.description4"
            />
          </Typography>
        </Box>
        <Box mt="30px">
          <Typography sx={{ lineHeight: "20px" }}>
            <Trans
              components={{
                highlight: <TextButton link="https://twitter.com/icpswap">https://twitter.com/icpswap</TextButton>,
              }}
              i18nKey="risk.description5"
            />
          </Typography>
        </Box>
      </Box>
      <Box mt="10px">
        <Flex
          fullWidth
          align="center"
          sx={{
            cursor: "pointer",
            userSelect: "none",
            gap: "0 5px",
            flexWrap: "nowrap",
          }}
          onClick={() => setIsRead(!isRead)}
        >
          <Checkbox
            checked={isRead}
            onChange={({ target: { checked } }) => {
              setIsRead(checked);
            }}
          />
          <Typography
            sx={{
              fontSize: "12px",
              wordBreak: "break-word",
              lineHeight: "20px",
            }}
          >
            {t("common.token.risk.agree")}
          </Typography>
        </Flex>
      </Box>
      <Box mt="10px">
        <Button fullWidth variant="contained" size="large" disabled={!isRead} onClick={handleRead}>
          {t("common.close")}
        </Button>
      </Box>
      <Box mt="5px">
        <Typography fontSize="10px" sx={{ lineHeight: "20px" }}>
          {t("risk.statements")}
        </Typography>
      </Box>
    </Modal>
  );
}
