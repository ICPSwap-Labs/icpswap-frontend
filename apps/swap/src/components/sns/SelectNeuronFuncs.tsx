import { useEffect, useMemo, useState } from "react";
import { useNeuronSystemFunctions } from "@icpswap/hooks";
import { Box, Checkbox, Typography } from "@mui/material";
import { Modal } from "@icpswap/ui";
import { Filter } from "react-feather";
import { useTranslation } from "react-i18next";

export interface SelectNeuronFuncsProps {
  onConfirm: (ids: bigint[], exclude_ids: bigint[]) => void;
  governance_id: string | undefined;
}

export function SelectNeuronFuncs({ governance_id, onConfirm }: SelectNeuronFuncsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [filterFuncIds, setFilterFuncIds] = useState<bigint[]>([]);
  const [selectedFuncIds, setSelectedFuncIds] = useState<bigint[]>([]);

  const { result } = useNeuronSystemFunctions(governance_id);

  const functions = useMemo(() => {
    return result?.functions.filter((e) => e.name !== "All non-critical topics");
  }, [result]);

  useEffect(() => {
    if (functions) {
      const functionIds = functions.map((e) => e.id);
      setSelectedFuncIds(functionIds);
      setFilterFuncIds(functionIds);
    }
  }, [functions]);

  const handleConfirm = () => {
    if (!functions) return;
    setFilterFuncIds(selectedFuncIds);
    const excludeIds = functions.filter((func) => !selectedFuncIds.includes(func.id)).map((func) => func.id);
    if (onConfirm) onConfirm(selectedFuncIds, excludeIds);
    setOpen(false);
  };

  const handleSelectAll = () => {
    if (!functions) return;
    setSelectedFuncIds(functions.map((e) => e.id));
  };

  const handleClear = () => {
    setSelectedFuncIds([]);
  };

  const handleCheckboxChange = (checked: boolean, id: bigint) => {
    if (checked) {
      setSelectedFuncIds([...selectedFuncIds, id]);
    } else {
      const newSelectedFuncIds = [...selectedFuncIds];
      newSelectedFuncIds.splice(newSelectedFuncIds.indexOf(id), 1);
      setSelectedFuncIds(newSelectedFuncIds);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "0 5px",
          alignItems: "center",
          width: "fit-content",
          padding: "5px 10px",
          cursor: "pointer",
          border: "1px solid #8492c4",
          borderRadius: "8px",
        }}
        onClick={() => setOpen(true)}
      >
        <Filter size="16px" />
        <Typography>{t("common.types")}</Typography>
        {functions ? (
          <Typography>
            ({filterFuncIds.length}/{functions.length})
          </Typography>
        ) : null}
      </Box>

      <Modal open={open} title={t("common.types")} onClose={() => setOpen(false)} showConfirm onConfirm={handleConfirm}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0 10px" }}>
          <Typography sx={{ fontSize: "16px", cursor: "pointer" }} onClick={handleSelectAll}>
            {t("common.select.all")}
          </Typography>
          <Typography sx={{ fontSize: "16px", cursor: "pointer" }} onClick={handleClear}>
            {t("common.clear")}
          </Typography>
        </Box>

        <Box
          sx={{
            margin: "20px 0 0 0",
            height: "360px",
            overflow: "hidden auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px 0",
          }}
        >
          {functions?.map((func) => (
            <Box key={func.id.toString()} sx={{ display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
              <Typography>{func.name}</Typography>
              <Checkbox
                checked={selectedFuncIds.includes(func.id)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                  handleCheckboxChange(checked, func.id)
                }
              />
            </Box>
          ))}
        </Box>
      </Modal>
    </>
  );
}
