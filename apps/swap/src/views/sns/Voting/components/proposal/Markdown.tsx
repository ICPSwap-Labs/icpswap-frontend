import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useTheme, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    textarea: {
      background: "transparent",
      width: "100% !important",
      border: "none",
      minHeight: "140px",
      outline: "none",
      color: theme.palette.text.secondary,
      font: "inherit",
      padding: "0 10px",
    },
  };
});

export interface MarkdownProps {
  limit?: number;
  maxFileSize?: number;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export default function Markdown({ limit = 14400, defaultValue, onChange }: MarkdownProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState("");

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    if (onChange) onChange(event.target.value);
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: `1px solid ${theme.palette.background.level4}`,
        marginTop: "10px",
        padding: "5px 0 0 0",
      }}
    >
      <textarea
        ref={textareaRef}
        maxLength={limit}
        className={classes.textarea}
        onChange={handleTextareaChange}
        value={value}
      />
    </Box>
  );
}
