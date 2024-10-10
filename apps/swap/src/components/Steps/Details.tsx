import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Modal } from "components/index";
import GreenCircleLoading from "components/Loading/GreenCircle";
import { Trans } from "@lingui/macro";
import { StepContents, StepDetailsProps } from "types/step";
import { Flex } from "@icpswap/ui";
import { isElement } from "react-is";

import { Arrow, SuccessIcon, ErrorIcon } from "./icons";

interface ActionIconProps {
  activeStep: number;
  ele: StepContents;
  errorStep: number | undefined;
  showErrorHint: boolean;
}

function ActionIcon({ ele, activeStep, showErrorHint }: ActionIconProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "52px", height: "44px", display: "flex", alignItems: "center" }}>
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
            <ErrorIcon />
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
          <Box>
            <SuccessIcon />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default function _StepDetails({
  title,
  onClose,
  open,
  content,
  activeStep,
  errorStep,
  description,
}: StepDetailsProps) {
  const [openedSteps, setOpenedSteps] = useState<number[]>([]);

  const theme = useTheme();

  const isStepOpened = (step: number) => {
    return !!openedSteps.includes(step) || step === activeStep;
  };

  const handleStepClick = (step: number) => {
    const index = openedSteps.indexOf(step);

    if (index === -1) {
      setOpenedSteps([...openedSteps, step]);
    } else {
      const newOpenedSteps = [...openedSteps];
      newOpenedSteps.splice(index, 1);
      setOpenedSteps([...newOpenedSteps]);
    }
  };

  useEffect(() => {
    if (activeStep === content.length) {
      if (onClose) onClose();
    }
  }, [content, activeStep]);

  const showErrorHint = (ele: StepContents) => {
    return errorStep === ele.step || !!ele.skipError;
  };

  return (
    <Modal open={open} title={title} onClose={onClose} contentPadding="18px 24px 24px 24px">
      {description ? <Typography lineHeight="20px">{description}</Typography> : null}

      <Box sx={{ width: "100%", height: "32px" }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px 0" }}>
        {content.map((ele, index) => {
          return (
            <Box
              key={`${ele.step}_${index}`}
              sx={{
                display: "flex",
              }}
            >
              <ActionIcon ele={ele} activeStep={activeStep} errorStep={errorStep} showErrorHint={showErrorHint(ele)} />
              <Box sx={{ flex: "1" }}>
                <Box
                  sx={{
                    display: "flex",
                    padding: "12px 20px",
                    border: `1px solid ${showErrorHint(ele) ? theme.colors.danger : theme.palette.background.level4}`,
                    borderRadius: "12px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    ...(isStepOpened(ele.step)
                      ? {
                          background: theme.palette.background.level1,
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                          borderBottomLeftRadius: ele.children ? "0" : "12px",
                          borderBottomRightRadius: ele.children ? "0" : "12px",
                        }
                      : {}),
                  }}
                  onClick={() => {
                    if (ele.children) handleStepClick(ele.step);
                  }}
                >
                  <Flex gap="0 4px">
                    <Typography color="text.primary" fontWeight={500} fontSize="16px">
                      {ele.step + 1}.
                    </Typography>
                    {isElement(ele.title) ? (
                      ele.title
                    ) : (
                      <Typography color="text.primary" fontWeight={500} fontSize="16px">
                        {ele.title}
                      </Typography>
                    )}
                  </Flex>

                  {ele.children ? (
                    <Box
                      sx={{
                        width: "16px",
                        height: "16px",
                        transition: "all 300ms",
                        ...(isStepOpened(ele.step) ? { transform: "rotate(180deg)" } : {}),
                      }}
                    >
                      <Arrow />
                    </Box>
                  ) : null}
                </Box>

                {isStepOpened(ele.step) && !!ele.children ? (
                  <Box
                    sx={{
                      borderLeft: `1px solid ${
                        showErrorHint(ele) ? theme.colors.danger : theme.palette.background.level4
                      }`,
                      borderBottom: `1px solid ${
                        showErrorHint(ele) ? theme.colors.danger : theme.palette.background.level4
                      }`,
                      borderRight: `1px solid ${
                        showErrorHint(ele) ? theme.colors.danger : theme.palette.background.level4
                      }`,
                      borderBottomLeftRadius: "12px",
                      borderBottomRightRadius: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "12px 20px",
                        background: theme.palette.background.level1,
                        borderBottomLeftRadius: "12px",
                        borderBottomRightRadius: "12px",
                      }}
                    >
                      {ele.children.map((ele1, index) => (
                        <Box
                          key={`${ele.step}_${index}_children`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: index === 0 ? "0px" : "12px",
                          }}
                        >
                          <Typography component="div" fontSize="12px">
                            {ele1.label}
                          </Typography>
                          <Typography component="div" fontSize="12px">
                            {ele1.value}
                          </Typography>
                        </Box>
                      ))}
                      {ele.skipError ? (
                        <Box
                          key={`${ele.step}_skip_error_children`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: index === 0 ? "0px" : "8px",
                          }}
                        >
                          <Typography component="div">
                            <Trans>Error</Trans>
                          </Typography>
                          <Typography component="div" color="text.danger" sx={{ maxWidth: "380px" }}>
                            {ele.skipError}
                          </Typography>
                        </Box>
                      ) : null}
                      {!!ele.errorMessage && errorStep === ele.step ? (
                        <Box
                          key={`${ele.step}_error_message_children`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: index === 0 ? "0px" : "8px",
                          }}
                        >
                          <Typography component="div">
                            <Trans>Error</Trans>
                          </Typography>
                          <Typography component="div" color="text.danger" sx={{ maxWidth: "380px" }}>
                            {ele.errorMessage}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>

                    {errorStep === ele.step && ele.errorActions && ele.errorActions.length > 0 ? (
                      <Flex
                        fullWidth
                        align="center"
                        sx={{
                          background: theme.palette.background.level2,
                          borderBottomLeftRadius: "12px",
                          borderBottomRightRadius: "12px",
                        }}
                      >
                        {ele.errorActions.map((action, index) => (
                          <Flex
                            key={`${ele.step}_${index}_action`}
                            sx={{
                              flex: 1,
                              borderLeft: index === 0 ? "none" : `1px solid ${theme.palette.background.level4}`,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "44px",
                              }}
                            >
                              {action}
                            </Box>
                          </Flex>
                        ))}
                      </Flex>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Modal>
  );
}
