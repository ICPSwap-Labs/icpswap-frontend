import { Flex, Modal } from "@icpswap/ui";
import { Box, Typography, useTheme } from "components/Mui";
import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

export type Guide = { step: number; title: string; image: string };

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  type?: "next" | "prev";
  active?: boolean;
  text?: string;
}

function Button({ disabled, type, onClick, active, text }: ButtonProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "12px",
        background: !active ? theme.palette.background.level4 : "#5669DC",
        cursor: "pointer",
        width: "56px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      onClick={onClick}
    >
      {text ? (
        <Typography color="text.primary">{text}</Typography>
      ) : type === "next" ? (
        <ChevronRight color={disabled ? "#999999" : active ? "#FFFFFF" : "#8492C4"} />
      ) : (
        <ChevronLeft color={disabled ? "#999999" : active ? "#FFFFFF" : "#8492C4"} />
      )}
    </Box>
  );
}

interface BeginnerGuideProps {
  open: boolean;
  onClose?: () => void;
  onGotIt?: () => void;
  guides: Guide[];
}

export function BeginnerGuideUI({ open, onClose, onGotIt, guides }: BeginnerGuideProps) {
  const [step, setStep] = useState(0);

  const handlePrev = useCallback(() => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, [setStep]);

  const handleNext = useCallback(() => {
    if (step === guides.length - 1 && onGotIt) {
      onGotIt();
      return;
    }

    setStep((prev) => (prev < guides.length ? prev + 1 : prev));
  }, [step, setStep, guides, onClose, onGotIt]);

  return (
    <Modal title="Quick Start" open={open} onClose={onClose}>
      <Typography>{guides[step].title}</Typography>
      <img src={guides[step].image} alt="" style={{ width: "100%", marginTop: 12 }} />
      <Box sx={{ margin: "12px 0 0 0" }}>
        <Flex fullWidth justify="space-between" align="center">
          <Typography>
            {step + 1}/{guides.length}
          </Typography>

          <Flex gap="0 16px">
            {step !== 0 ? <Button onClick={handlePrev} /> : null}
            <Button type="next" text={step === guides.length - 1 ? "Got it" : undefined} onClick={handleNext} active />
          </Flex>
        </Flex>
      </Box>
    </Modal>
  );
}
