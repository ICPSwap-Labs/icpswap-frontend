import { ReactNode, useCallback, useState } from "react";
import { Typography, Checkbox } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { RotateCcw } from "react-feather";
import { useSwapKeepTokenInPoolsManager } from "store/swap/cache/hooks";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { KeepTokenInPoolsConfirmModal } from "components/swap/KeepTokenInPoolsConfirm";
import { useGlobalContext } from "hooks/index";
import { useTranslation } from "react-i18next";

export interface KeepTokenInPoolProps {
  ui?: "pro" | "normal";
  refreshKey?: string;
  label?: ReactNode;
  showRefresh?: boolean;
}

export function KeepTokenInPool({ ui, label, showRefresh = true, refreshKey }: KeepTokenInPoolProps) {
  const { t } = useTranslation();
  const [checkOpen, setCheckOpen] = useState(false);

  const { setRefreshTriggers } = useGlobalContext();

  const [keepInPools, updateKeepInPools] = useSwapKeepTokenInPoolsManager();

  const handleCheckChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setCheckOpen(true);
    }
  }, []);

  const handleToggleCheck = useCallback(() => {
    if (!keepInPools) {
      setCheckOpen(true);
    } else {
      updateKeepInPools(false);
    }
  }, [setCheckOpen, keepInPools, updateKeepInPools]);

  const handleRefresh = useCallback(() => {
    if (setRefreshTriggers && nonUndefinedOrNull(refreshKey)) {
      setRefreshTriggers(refreshKey);
    }
  }, [setRefreshTriggers, refreshKey]);

  const handleCheckConfirm = useCallback(() => {
    updateKeepInPools(true);
    setCheckOpen(false);
  }, [updateKeepInPools, setCheckOpen]);

  return (
    <>
      <Flex justify="space-between" align="center" sx={{ margin: ui === "pro" ? "12px 0 0 0" : "18px 0 0 0" }}>
        <Flex
          sx={{ width: "fit-content", cursor: "pointer", userSelect: "none" }}
          gap="0 4px"
          onClick={handleToggleCheck}
          align="center"
        >
          <Checkbox size="small" onChange={handleCheckChange} checked={keepInPools} />

          <Typography sx={{ fontSize: "12px", lineHeight: "16px" }}>{label ?? t("swap.keep.tokens")}</Typography>
        </Flex>

        {showRefresh ? <RotateCcw size={14} style={{ cursor: "pointer" }} onClick={handleRefresh} /> : null}
      </Flex>

      <KeepTokenInPoolsConfirmModal
        open={checkOpen}
        onCancel={() => setCheckOpen(false)}
        onConfirm={handleCheckConfirm}
      />
    </>
  );
}
