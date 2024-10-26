import React from "react";
import { Typography } from "@mui/material";
import { Modal } from "./Modal";

export interface ConfirmModalProps {
  title: string | React.ReactNode;
  showClose?: boolean;
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  text: string;
}

export function ConfirmModal({ title, open, text, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <Modal open={open} title={title} showConfirm confirmText="Confirm" onConfirm={onConfirm} onClose={onClose}>
      <Typography color="text.primary" fontSize="16px">
        {text}
      </Typography>
    </Modal>
  );
}
