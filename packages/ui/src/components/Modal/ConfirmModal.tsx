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
    <Modal
      open={open}
      title={title}
      showConfirm
      showCancel
      confirmText="Confirm"
      cancelText="Cancel"
      onCancel={onClose}
      onConfirm={onConfirm}
    >
      <Typography color="text.primary" fontSize="16px">
        {text}
      </Typography>
    </Modal>
  );
}
