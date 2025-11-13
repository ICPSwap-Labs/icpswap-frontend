import { Flex, LoadingRow, Modal, NoData, Proportion } from "@icpswap/ui";
import { Box, Button, Typography, useTheme, Collapse } from "components/Mui";
import { ArrowUp, ChevronUp } from "react-feather";
import { deletePriceAlert, useInfoToken, usePriceAlertEmail, usePriceAlerts } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { formatDollarTokenPrice, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { ResultStatus, type AlertInfo } from "@icpswap/types";
import { PRICE_ALERTS_MODAL_WIDTH } from "constants/swap";
import { useCallback, useMemo, useState } from "react";
import { EmailSetting } from "components/PriceAlerts/EmailSetting";
import { CreateAlertsModal } from "components/PriceAlerts/CreateAlerts";
import { useTranslation } from "react-i18next";
import { TIP_ERROR, TIP_SUCCESS, useTips, useToken } from "hooks/index";
import { useShowEmailManager } from "components/PriceAlerts/state";

enum COLOR {
  up = "#54C081",
  down = "#D3625B",
}

type SortedAlerts = {
  tokenId: string;
  alerts: Array<AlertInfo>;
};

interface PriceAlertRowProps {
  alert: AlertInfo;
  refetch: () => void;
}

function PriceAlertRow({ alert, refetch }: PriceAlertRowProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);

  const alert_message = useMemo(() => {
    const type = alert.alertType;

    if ("PriceIncrease" in type) return t("price.alerts.rises.to", { value: alert.alertValue });
    if ("PriceDecrease" in type) return t("price.alerts.drops.to", { value: alert.alertValue });
    if ("MarginOfIncrease24H" in type) return t("price.alerts.24h.increase.to", { value: alert.alertValue });

    return t("price.alerts.24h.decrease.to", { value: alert.alertValue });
  }, [alert]);

  const isPriceIncreaseAlert = useMemo(() => {
    const type = alert.alertType;
    if ("PriceIncrease" in type) return true;
    if ("PriceDecrease" in type) return false;
    if ("MarginOfIncrease24H" in type) return true;
    return false;
  }, [alert]);

  const handleDeleteAlert = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    const { status, message } = await deletePriceAlert(alert.id);

    if (status === ResultStatus.OK) {
      openTip("Delete alert successfully", TIP_SUCCESS);
      refetch();
    } else {
      openTip(message ?? "Failed to delete alert", TIP_ERROR);
    }

    setLoading(false);
  }, [alert, openTip, refetch]);

  return (
    <Box
      sx={{
        width: "100%",
        background: theme.palette.background.level3,
        borderRadius: "16px",
        padding: "16px",
        cursor: "pointer",
        "&:hover": {
          ".delete-icon": {
            visibility: "visible",
          },
        },
      }}
    >
      <Flex justify="space-between">
        <Flex gap="0 12px" align="flex-start">
          <ArrowUp
            color={isPriceIncreaseAlert ? COLOR.up : COLOR.down}
            size={20}
            style={{ rotate: isPriceIncreaseAlert ? "0deg" : "180deg" }}
          />

          <Flex vertical align="flex-start" gap="8px 0">
            <Typography color="text.primary">{alert_message}</Typography>
            <Typography fontSize="12px">
              {alert.repeated ? t("price.alerts.alert.type.every.time") : t("price.alerts.alert.type.once.only")}
            </Typography>
          </Flex>
        </Flex>

        <Box
          className="delete-icon"
          sx={{ width: "20px", height: "20px", cursor: "pointer", visibility: "hidden" }}
          onClick={handleDeleteAlert}
        >
          <img width="100%" height="100%" src="/images/delete.svg" alt="" />
        </Box>
      </Flex>
    </Box>
  );
}

interface PriceAlertsGroupProps {
  alerts: Array<AlertInfo>;
  refetch: () => void;
  tokenId: string;
}

function PriceAlertsGroup({ alerts, tokenId, refetch }: PriceAlertsGroupProps) {
  const [, token] = useToken(tokenId);
  const infoToken = useInfoToken(tokenId);

  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <Box>
      <Flex fullWidth justify="space-between" sx={{ cursor: "pointer" }} onClick={handleToggle}>
        <Typography sx={{ color: "text.primary", fontSize: "16px", fontWeight: 500 }}>{token?.symbol}</Typography>
        <Flex gap="0 12px">
          {nonUndefinedOrNull(infoToken) ? (
            <Flex vertical gap="4px 0" align="flex-end">
              <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
                {formatDollarTokenPrice(infoToken.price)}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "text.success" }} component="div">
                <Proportion value={infoToken.priceChange24H} showArrow={false} />
              </Typography>
            </Flex>
          ) : null}

          <ChevronUp
            style={{ color: "#8492C4", transform: open ? "rotate(0)" : "rotate(180deg)", transition: "all 300ms" }}
            size={16}
            strokeWidth={1}
          />
        </Flex>
      </Flex>

      <Collapse in={open} timeout="auto" sx={{ width: "100%" }}>
        <Flex vertical fullWidth align="flex-start" gap="8px 0" sx={{ margin: "16px 0 0 0" }}>
          {alerts.map((element) => (
            <PriceAlertRow key={element.id.toString()} alert={element} refetch={refetch} />
          ))}
        </Flex>
      </Collapse>
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
  const { isPending: isAlertsPending, data: alerts, refetch } = usePriceAlerts(principal);
  const { t } = useTranslation();
  const [showEmail, setShowEmail] = useShowEmailManager();
  const [showCreateAlert, setShowCreateAlert] = useState<boolean>(false);

  const handleCreateAlert = useCallback(() => {
    if (alertEmailPending) return;
    if (isUndefinedOrNull(alertEmail)) {
      setShowEmail(true);
      return;
    }

    setShowCreateAlert(true);
  }, [alertEmail, alertEmailPending]);

  const handleRefreshAlerts = useCallback(() => {
    refetch();
  }, [refetch]);

  const sortedAlerts = useMemo(() => {
    if (isUndefinedOrNull(alerts)) return [];

    return alerts.reduce((prev, curr) => {
      const index = prev.findIndex((element) => element.tokenId === curr.tokenId);

      if (index === -1) {
        return prev.concat([{ tokenId: curr.tokenId, alerts: [curr] }]);
      }

      const new_alerts = [...prev];

      new_alerts.splice(index, 1, {
        tokenId: prev[index].tokenId,
        alerts: [...prev[index].alerts, curr],
      });

      return new_alerts;
    }, [] as Array<SortedAlerts>);
  }, [alerts]);

  return (
    <>
      <Modal
        open={open}
        title={t("price.alerts.list.title")}
        dialogWidth={PRICE_ALERTS_MODAL_WIDTH}
        onClose={onClose}
        onCancel={onClose}
      >
        <Box sx={{ minHeight: "480px", maxHeight: "520px", overflow: "hidden auto" }}>
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
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px 0" }}>
              {sortedAlerts.map((element) => (
                <PriceAlertsGroup
                  key={element.tokenId.toString()}
                  alerts={element.alerts}
                  tokenId={element.tokenId}
                  refetch={refetch}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ margin: "32px 0 0 0" }}>
          <Button variant="contained" size="large" fullWidth onClick={handleCreateAlert}>
            Create alert
          </Button>
        </Box>
      </Modal>

      {showEmail ? <EmailSetting open={showEmail} onClose={() => setShowEmail(false)} /> : null}
      {showCreateAlert && alertEmail ? (
        <CreateAlertsModal
          open={showCreateAlert}
          onClose={() => setShowCreateAlert(false)}
          email={alertEmail}
          onCreateSuccess={handleRefreshAlerts}
        />
      ) : null}
    </>
  );
}
