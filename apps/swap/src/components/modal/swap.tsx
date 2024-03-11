import React from "react";
import Modal from "./index";
import { useTheme } from "@mui/material";
import { isDarkTheme } from "utils";
import { Theme } from "@mui/material/styles";

export default ({
  width = "570px",
  open,
  children,
  ...props
}: {
  width?: string;
  open: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const theme = useTheme() as Theme;

  return (
    <Modal
      open={open}
      maxWidth="lg"
      {...props}
      dialogProps={{
        sx: {
          "& .MuiDialog-paper": {
            width,
            backgroundColor: isDarkTheme(theme) ? theme.palette.background.level2 : theme.colors.lightGray200,
          },
          ...(props.dialogProps?.sx || {}),
        },
      }}
    >
      {children}
    </Modal>
  );
};
