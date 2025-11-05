import { Flex, LoadingRow, Modal, NoData } from "@icpswap/ui";
import { Box, Button, TextField, Typography, useTheme } from "components/Mui";
import { SelectToken } from "components/Select/SelectToken";
import { ArrowUp } from "react-feather";
import { usePriceAlertEmail, usePriceAlerts } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import type { AlertInfo } from "@icpswap/types";
import { PRICE_ALERTS_MODAL_WIDTH } from "constants/swap";
import { useCallback, useState } from "react";
import { EmailSetting } from "components/PriceAlerts/EmailSetting";
import { CreateAlertsModal } from "components/PriceAlerts/CreateAlerts";

enum COLOR {
  up = "#54C081",
  down = "#D3625B",
}

interface PriceAlertRowProps {
  alert: AlertInfo;
}

function PriceAlertRow({ alert }: PriceAlertRowProps) {
  const theme = useTheme();

  return (
    <Box sx={{ background: theme.palette.background.level3, borderRadius: "16px" }}>
      <Flex justify="space-between">
        <Box>
          <Flex gap="0 12px">
            <ArrowUp color={COLOR.up} />
            <Typography color="text.primary">Price rises to 10000</Typography>
          </Flex>
          <Typography fontSize="12px">Once only</Typography>
        </Box>

        <img src="/images/delete.svg" alt="" />
      </Flex>
    </Box>
  );
}

interface PriceAlertsProps {
  open: boolean;
  onClose?: () => void;
}

export function PriceAlerts({ open, onClose }: PriceAlertsProps) {
  const principal = useAccountPrincipalString();
  const { isPending: alertEmailPending, data: alertEmail } = usePriceAlertEmail(principal);
  const { isPending: isAlertsPending, data: alerts } = usePriceAlerts();

  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [showCreateAlert, setShowCreateAlert] = useState<boolean>(false);

  console.log("alertEmailPending: ", alertEmailPending);
  console.log("alertEmail: ", alertEmail);

  const handleCreateAlert = useCallback(() => {
    if (alertEmailPending) return;
    if (isUndefinedOrNull(alertEmail)) {
      setShowEmail(true);
      return;
    }

    setShowCreateAlert(true);
  }, [alertEmail, alertEmailPending]);

  return (
    <>
      <Modal
        open={open}
        title="Price alerts"
        dialogWidth={PRICE_ALERTS_MODAL_WIDTH}
        onClose={onClose}
        onCancel={onClose}
      >
        <Box sx={{ minHeight: "480px" }}>
          {isAlertsPending ? (
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          ) : isUndefinedOrNull(alerts) || alerts.length === 0 ? (
            <NoData />
          ) : (
            alerts.map((element) => <PriceAlertRow key={element.id.toString()} alert={element} />)
          )}
        </Box>

        <Box sx={{ margin: "32px 0 0 0" }}>
          <Button variant="contained" size="large" fullWidth onClick={handleCreateAlert}>
            Create alert
          </Button>
        </Box>
      </Modal>

      {showEmail ? <EmailSetting open={showEmail} onClose={() => setShowEmail(false)} /> : null}
      <CreateAlertsModal open={showCreateAlert} onClose={() => setShowCreateAlert(false)} />
    </>
  );
}
