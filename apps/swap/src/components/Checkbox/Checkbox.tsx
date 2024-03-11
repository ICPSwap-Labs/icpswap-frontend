import { useContext } from "react";
import { Box } from "@mui/material";
import CheckboxGroupContext from "./context";

function UncheckedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" stroke="#5669DC" strokeWidth="2" />
    </svg>
  );
}

function CheckedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#5669DC" />
      <path
        d="M14.2 8.2L9.4 13C9 13.4 8.4 13.4 8 13L5.8 10.8C5.4 10.4 5.4 9.8 5.8 9.4C6.2 9 6.8 9 7.2 9.4L8.7 10.9L12.8 6.8C13.2 6.4 13.8 6.4 14.2 6.8C14.6 7.2 14.6 7.8 14.2 8.2Z"
        fill="white"
      />
    </svg>
  );
}

export interface CheckboxProps {
  value: string;
  radio?: boolean;
}

export default function Checkbox({ value, radio }: CheckboxProps) {
  const { checked, onChange } = useContext(CheckboxGroupContext);

  const isCheck = checked.includes(value);

  const handleToggle = () => {
    if (radio) {
      if (checked.includes(value)) {
        onChange([]);
      } else {
        onChange([value]);
      }
      return;
    }

    if (checked.includes(value)) {
      const _checked = [...checked];
      _checked.splice(_checked.indexOf(value), 1);
      onChange(_checked);
    } else {
      onChange([...checked, value]);
    }
  };

  return (
    <Box sx={{ width: "20px", height: "20px", cursor: "pointer" }} component="span" onClick={handleToggle}>
      {isCheck ? <CheckedIcon /> : <UncheckedIcon />}
    </Box>
  );
}
