import { useEffect, useState } from "react";
import { SnsProposalDecisionStatus } from "@icpswap/constants";
import { Box, Checkbox, Typography } from "components/Mui";
import { Modal } from "@icpswap/ui";
import { Filter } from "react-feather";
import { useTranslation } from "react-i18next";

const SnsProposalDecisionStatusMap = [
  { value: SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_OPEN, label: "Open" },
  { value: SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_REJECTED, label: "Rejected" },
  { value: SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_ADOPTED, label: "Adopted" },
  { value: SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_EXECUTED, label: "Executed" },
  { value: SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_FAILED, label: "Failed" },
];

export interface SelectNeuronProposalStatusProps {
  governance_id: string | undefined;
  onChange: (status: SnsProposalDecisionStatus[]) => void;
}

export function SelectNeuronProposalStatus({ governance_id, onChange }: SelectNeuronProposalStatusProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<SnsProposalDecisionStatus[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<SnsProposalDecisionStatus[]>([]);

  useEffect(() => {
    const status = SnsProposalDecisionStatusMap.map((e) => e.value);
    setSelectedStatus(status);
    setFilteredStatus(status);
  }, [governance_id]);

  const handleConfirm = () => {
    onChange(selectedStatus);
    setFilteredStatus(selectedStatus);
    setOpen(false);
  };

  const handleSelectAll = () => {
    setSelectedStatus(SnsProposalDecisionStatusMap.map((e) => e.value));
  };

  const handleClear = () => {
    setSelectedStatus([]);
  };

  const handleCheckboxChange = (checked: boolean, id: SnsProposalDecisionStatus) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, id]);
    } else {
      const newSelectedStatus = [...selectedStatus];
      newSelectedStatus.splice(newSelectedStatus.indexOf(id), 1);
      setSelectedStatus(newSelectedStatus);
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
        <Typography>{t("nns.proposal.status")}</Typography>
        <Typography>
          ({filteredStatus.length}/{SnsProposalDecisionStatusMap.length})
        </Typography>
      </Box>

      <Modal
        open={open}
        title={t("nns.proposal.status")}
        onClose={() => setOpen(false)}
        showConfirm
        onConfirm={handleConfirm}
      >
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
          {SnsProposalDecisionStatusMap?.map((element) => (
            <Box key={element.value} sx={{ display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
              <Typography>{element.label}</Typography>
              <Checkbox
                checked={selectedStatus.includes(element.value)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                  handleCheckboxChange(checked, element.value)
                }
              />
            </Box>
          ))}
        </Box>
      </Modal>
    </>
  );
}
