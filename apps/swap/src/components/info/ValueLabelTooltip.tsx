import { useState, useRef } from "react";
import { Box } from "components/Mui";
import { ValueLabelMenus } from "components/info/ValueLabelMenus";
import { HelpCircle } from "react-feather";

export function ValueLabelTooltip() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Box width="16px" height="16px" ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <HelpCircle size={16} />
      <ValueLabelMenus anchor={ref?.current} onClickAway={() => setOpen(false)} open={open} />
    </Box>
  );
}
