import { useState } from "react";
import { Grid, Typography, Box, Checkbox, Button } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import Modal from "components/modal/index";
import { Trans, t } from "@lingui/macro";
import { TextButton } from "components/index";
import storage from "redux-persist/lib/storage";

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

export default function RiskStatementModal({
  open,
  onClose,
  onRead,
}: {
  open: boolean;
  onClose: () => void;
  onRead: () => void;
}) {
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
      title={t`Risk Warning`}
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
        <Typography>
          <Trans>There is always some potential risk in using Tokens and/or Cryptos. DYOR before investing.</Trans>
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Box>
          <Typography>
            <Trans>
              1. ICPSwap is a decentralized financial hub of the Internet Computer, providing the transaction function
              of various tokens and NFTs within its ecosystem and other services. All the services are deployed on the
              Internet Computer, and all transactions can be checked on the Internet Computer protocol. Only you can be
              responsible for your own funds. Please make sure to keep your funds safe and be vigilant of fraud.
            </Trans>
          </Typography>
        </Box>
        <Box mt="30px">
          <Typography>
            <Trans>
              2. The Internet Computer ecosystem is in its growth stage. All functions of ICPSwap have undergone
              multiple rounds of internal and public testing and also iterative repair, The ICPSwap DApp is now under
              SNS control, enhancing its security!
            </Trans>
          </Typography>
        </Box>
        <Box mt="30px">
          <Typography>
            <Trans>
              3. Anyone who has the seed phrase of a wallet address has control of the funds in that wallet. Never share
              your seed phrase under any circumstances whatsoever, including with the ICPSwap team.
            </Trans>
          </Typography>
        </Box>
        <Box mt="30px">
          <Typography>
            <Trans>
              4. Please stay vigilant to phishing attacks and make sure you are visiting{" "}
              <Typography color="primary" component="span">
                https://app.icpswap.com
              </Typography>{" "}
              - check the URL carefully.
            </Trans>
          </Typography>
        </Box>
        <Box mt="30px">
          <Typography>
            <Trans>
              5. For any events and news about ICPSwap, please refer to ICPSwap's Twitter:{" "}
              <TextButton link="https://twitter.com/icpswap">https://twitter.com/icpswap</TextButton> or @ICPSwap
            </Trans>
          </Typography>
        </Box>
      </Box>
      <Box mt="10px">
        <Grid
          container
          alignItems="center"
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
            }}
          >
            <Trans>I have read the risk warning carefully and agree to take the risk myself</Trans>
          </Typography>
        </Grid>
      </Box>
      <Box mt="10px">
        <Button fullWidth variant="contained" size="large" disabled={!isRead} onClick={handleRead}>
          <Trans>Close</Trans>
        </Button>
      </Box>
      <Box mt="5px">
        <Typography fontSize="10px">
          <Trans>* The ICPSwap founding team reserves right for the final explanation of all the statements.</Trans>
        </Typography>
      </Box>
    </Modal>
  );
}
