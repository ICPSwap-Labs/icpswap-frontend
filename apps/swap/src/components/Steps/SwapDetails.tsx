import { useEffect } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import GreenCircleLoading from "components/Loading/GreenCircle";
import { StepContents, StepDetailsProps } from "types/step";
import { Flex, Modal } from "@icpswap/ui";
import { isElement } from "react-is";

interface ActionIconProps {
  activeStep: number;
  ele: StepContents;
  errorStep: number | undefined;
  showErrorHint: boolean;
}

function ActionIcon({ ele, activeStep, showErrorHint }: ActionIconProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "38px", height: "32px", display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showErrorHint ? (
          <Box>
            <img width="32px" height="32px" src="/images/swap/swap-error.svg" alt="" />
          </Box>
        ) : activeStep < ele.step ? (
          <Box
            sx={{
              width: "8px",
              height: "8px",
              background: theme.palette.background.level4,
              borderRadius: "50%",
            }}
          />
        ) : activeStep === ele.step ? (
          <GreenCircleLoading />
        ) : ele.step < activeStep ? (
          <img width="32px" height="32px" src="/images/swap/swap-success.png" alt="" />
        ) : null}
      </Box>
    </Box>
  );
}

export function SwapStepDetails({
  title,
  onClose,
  open,
  content,
  activeStep,
  errorStep,
  description,
}: StepDetailsProps) {
  useEffect(() => {
    if (activeStep === content.length) {
      if (onClose) onClose();
    }
  }, [content, activeStep]);

  const showErrorHint = (ele: StepContents) => {
    return errorStep === ele.step || !!ele.skipError;
  };

  return (
    <Modal open={open} title={title} onClose={onClose} dialogWidth="450px">
      {description ? <Typography lineHeight="20px">{description}</Typography> : null}

      <Box sx={{ width: "100%", height: "32px" }} />

      <Flex fullWidth justify="center" sx={{ margin: "0 0 20px 0" }}>
        <img src="/images/swap/swap-loading.png" width="150px" height="133px" alt="" />
      </Flex>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px 0" }}>
        {content.map((ele, index) => {
          return (
            <Box key={`${ele.step}_${index}`}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ActionIcon
                  ele={ele}
                  activeStep={activeStep}
                  errorStep={errorStep}
                  showErrorHint={showErrorHint(ele)}
                />

                <Box sx={{ flex: "1" }}>
                  {isElement(ele.title) ? (
                    ele.title
                  ) : (
                    <Typography color="text.primary" fontWeight={500}>
                      {ele.title}
                    </Typography>
                  )}
                </Box>
              </Box>

              {ele.description ? (
                <Box sx={{ padding: "0 0 0 42px", margin: "7px 0 0 0" }}>{ele.description}</Box>
              ) : null}
            </Box>
          );
        })}
      </Box>
    </Modal>
  );
}
