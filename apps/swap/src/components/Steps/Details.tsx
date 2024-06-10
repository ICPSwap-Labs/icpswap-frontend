import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Modal } from "components/index";
import { Theme } from "@mui/material/styles";
import GreenCircleLoading from "components/Loading/GreenCircle";
import { Trans } from "@lingui/macro";
import { Arrow, SuccessIcon, ErrorIcon } from "./icons";
import { StepDetails, StepDetailsProps } from "./types";

interface ActionIconProps {
  activeStep: number;
  ele: StepDetails;
  errorStep: number | undefined;
  showErrorHint: boolean;
}

function ActionIcon({ ele, activeStep, showErrorHint }: ActionIconProps) {
  const theme = useTheme() as Theme;

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

export default function _StepDetails({ title, onClose, open, content, activeStep, errorStep }: StepDetailsProps) {
  const [openedSteps, setOpenedSteps] = useState<number[]>([]);

  const theme = useTheme() as Theme;

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

  const showErrorHint = (ele: StepDetails) => {
    return errorStep === ele.step || !!ele.skipError;
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
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
                  <Typography color="text.primary" fontWeight={500}>
                    {ele.step + 1}. {ele.title}
                  </Typography>

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
                            marginTop: index === 0 ? "0px" : "8px",
                          }}
                        >
                          <Typography component="div">{ele1.label}</Typography>
                          <Typography component="div">{ele1.value}</Typography>
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
                      <Grid
                        container
                        alignItems="center"
                        sx={{
                          background: theme.palette.background.level2,
                          borderBottomLeftRadius: "12px",
                          borderBottomRightRadius: "12px",
                        }}
                      >
                        {ele.errorActions.map((action, index) => (
                          <Grid
                            key={`${ele.step}_${index}_action`}
                            item
                            xs
                            sx={{
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
                          </Grid>
                        ))}
                      </Grid>
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
