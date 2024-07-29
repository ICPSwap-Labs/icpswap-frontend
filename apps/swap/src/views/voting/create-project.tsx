import { useState } from "react";
import { Grid, Button, Typography, Box, CircularProgress } from "@mui/material";
import { Wrapper, MainCard, FilledTextField } from "components/index";
import { Trans, t } from "@lingui/macro";
import Upload from "components/upload/index";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { createVotingCanister } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { isValidPrincipal } from "@icpswap/utils";
import { TOKEN_STANDARD } from "constants/tokens";

export type Values = {
  name: string;
  logo: string;
  manager: string;
  tokenId: string;
  standard: string;
};

export const TokenStandards = [
  { label: "EXT", value: TOKEN_STANDARD.EXT },
  { label: "DIP20", value: TOKEN_STANDARD.DIP20 },
];

export default function CreateVotingProject() {
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Values>({
    name: "",
    logo: "",
    manager: "",
    tokenId: "",
    standard: "",
  });

  const onFiledChange = (value: any, field: string) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const handleCreateProject = async () => {
    if (loading) return;

    setLoading(true);

    const { status, message } = await createVotingCanister({
      logo: values.logo,
      name: values.name,
      managerAddress: { principal: Principal.fromText(values.manager) },
      tokenCid: values.tokenId,
      projectCid: "",
      tokenStand: values.standard,
    });

    if (status === "ok") {
      openSuccessTip(t`Created successfully`);
    } else {
      openErrorTip(message);
    }

    setLoading(false);
  };

  let errorMessage = "";

  if (!values.name) errorMessage = t`Enter the name`;
  if (!values.logo) errorMessage = t`Enter the logo`;
  if (!values.standard) errorMessage = t`Select the token standard`;
  if (!values.manager) errorMessage = t`Enter the manager principal`;
  if (values.manager && !isValidPrincipal(values.manager)) errorMessage = t`Invalid principal`;
  if (!values.tokenId) errorMessage = t`Enter the token id`;

  return (
    <Wrapper>
      <MainCard>
        <Grid container justifyContent="center">
          <Box sx={{ width: "100%", maxWidth: "570px" }}>
            <Box mt="20px">
              <Box mt="20px">
                <FilledTextField
                  label={<Trans>Token Canister Id</Trans>}
                  onChange={(value) => onFiledChange(value, "tokenId")}
                />
              </Box>

              <Box mt="20px">
                <FilledTextField
                  label={<Trans>Token Standard</Trans>}
                  select
                  menus={TokenStandards}
                  placeholder={t`Select the token standard`}
                  onChange={(value) => onFiledChange(value, "standard")}
                  value={values.standard}
                />
              </Box>

              <Box mt="20px">
                <FilledTextField label={<Trans>Name</Trans>} onChange={(value) => onFiledChange(value, "name")} />
              </Box>

              <Box mt="20px">
                <Typography color="text.secondary">
                  <Trans>Logo</Trans>
                </Typography>

                <Box mt="20px">
                  <Box
                    sx={{
                      height: "160px",
                    }}
                  >
                    <Upload
                      defaultValue={values.logo}
                      onChange={(result) => {
                        if ((typeof result).toLowerCase() === "string") {
                          onFiledChange(result, "logo");
                        } else if (!result.status && result.message) {
                          openErrorTip(result.message);
                        }
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box mt={1}>
                    <Typography>
                      <Trans>Support : png / jpg / gif; Size: ≤1M</Trans>
                    </Typography>
                  </Box>
                  <Box mt="10px">
                    <FilledTextField
                      label={<Trans>Or</Trans>}
                      value={values.logo}
                      onChange={(value: string) => onFiledChange(value, "logo")}
                      fullWidth
                    />
                  </Box>
                </Box>
              </Box>

              <Box mt="20px">
                <FilledTextField
                  label={<Trans>Manager Principal</Trans>}
                  onChange={(value) => onFiledChange(value, "manager")}
                />
              </Box>

              <Box mt="20px">
                <Button
                  onClick={handleCreateProject}
                  disabled={loading || !!errorMessage}
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
                >
                  {errorMessage || t`Create voting project`}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </MainCard>
    </Wrapper>
  );
}
