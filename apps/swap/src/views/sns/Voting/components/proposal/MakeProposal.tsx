/* eslint-disable no-lonely-if */
import { useTheme } from "@mui/material";
import { Box, CircularProgress, Typography, Button } from "components/Mui";
import { Theme } from "@mui/material/styles";
import { t, Trans } from "@lingui/macro";
import { Modal, FilledTextField, Flex } from "components/index";
import BaseMarkdown from "components/markdown/BaseMarkdown";
import { useMemo, useState, useRef } from "react";
import { Eye, EyeOff } from "react-feather";
import { useListNeurons, useNervousSystemParameters, neuronMakeProposal } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { SnsNeuronPermissionType } from "@icpswap/constants";
import { Select } from "components/Select/ForToken";
import { neuronHasBalance, getNeuronVotingPower, neuronFormat } from "utils/sns/index";
import { availableArgsNull, shorten, hexToBytes } from "@icpswap/utils";
import { ProposalAction, ResultStatus } from "@icpswap/types";
import { useTips, MessageTypes } from "hooks/useTips";

import Markdown from "./Markdown";
import { SelectProposalType, type SelectProposalTypeRef } from "./SelectProposalType";

type Values = {
  summary: string | undefined;
  title: string | undefined;
  url: string | undefined;
  neuronId: string | undefined;
  type: string | undefined;
};

export interface MakeProposalProps {
  open: boolean;
  governanceId: string | undefined;
  onClose?: () => void;
}

export function MakeProposal({ governanceId, open, onClose }: MakeProposalProps) {
  const theme = useTheme() as Theme;
  const [values, setValues] = useState<Values>({} as Values);
  const [preview, setPreview] = useState<boolean>(false);
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState(false);
  const [openTip] = useTips();

  const ref = useRef<SelectProposalTypeRef>(null);

  const handleValueChange = (value: string, key: keyof Values) => {
    setValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const { result: neurons } = useListNeurons({
    canisterId: governanceId,
    of_principal: principal?.toString(),
    limit: 100,
  });
  const { result: neuronSystemParameters } = useNervousSystemParameters(governanceId);

  const filteredNeurons = useMemo(() => {
    if (!neurons || !neuronSystemParameters) return undefined;

    return neurons.filter((neuron) => {
      const hasMakeProposalPermission = neuron.permissions.find((permission) =>
        permission.permission_type.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_SUBMIT_PROPOSAL),
      );

      const hasBalance = neuronHasBalance(neuron, neuronSystemParameters);

      // TODO: decimals
      const votingPower = getNeuronVotingPower(neuron, neuronSystemParameters, 8);

      return hasMakeProposalPermission && votingPower && Number(votingPower) > 0 && hasBalance;
    });
  }, [neurons, neuronSystemParameters]);

  const neuronMenus = useMemo(() => {
    if (!filteredNeurons) return [];

    return filteredNeurons.map((neuron) => {
      const formattedNeuron = neuronFormat(neuron);
      return { label: shorten(formattedNeuron.id, 12), value: formattedNeuron.id };
    });
  }, [filteredNeurons]);

  const handleNeuronIdChange = (neuronId: string) => {
    setValues({
      ...values,
      neuronId,
    });
  };

  const handleMakeProposal = async () => {
    if (!governanceId || !values.neuronId || !values.title || !ref.current || loading) return;

    const args = ref.current.submit();

    if (!args) {
      openTip(t`Something wrong in Proposal Type`, MessageTypes.error);
      return;
    }

    setLoading(true);

    console.log("governanceId:", governanceId);
    console.log("neuron hex:", hexToBytes(values.neuronId));
    console.log("Make proposal args: ", {
      url: values.url ?? "",
      title: values.title,
      action: availableArgsNull<ProposalAction>(args),
      summary: values.summary ?? "",
    });

    const { status, data, message } = await neuronMakeProposal(governanceId, hexToBytes(values.neuronId), {
      url: values.url ?? "",
      title: values.title,
      action: availableArgsNull<ProposalAction>(args),
      summary: values.summary ?? "",
    });

    if (data && data.command[0] && "Error" in data.command[0]) {
      const __message = data.command[0].Error.error_message;
      const __type = data.command[0].Error.error_type;
      openTip(t`Failed to make proposal: ${__type}, ${__message}` ?? t`Failed to make proposal`, MessageTypes.error);
    } else {
      if (status === ResultStatus.OK) {
        openTip(t`Make proposal successfully`, MessageTypes.success);
      } else {
        openTip(message ?? t`Failed to make proposal`, MessageTypes.error);
      }
    }

    setLoading(false);
  };

  const error = useMemo(() => {
    if (!values.title) return t`Enter the title`;
    if (!values.neuronId) return t`Select the neuron`;
    return undefined;
  }, [values]);

  return (
    <Modal title={t`Make Proposal`} open={open} onClose={onClose}>
      <Flex vertical gap="20px 0" align="flex-start">
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ color: "text.primary", margin: "0 0 10px 0" }}>
            <Trans>Neuron ID</Trans>
          </Typography>

          <Select
            value={values.neuronId}
            placeholder="Select a neuron id"
            menus={neuronMenus}
            onChange={handleNeuronIdChange}
            menuMaxHeight="340px"
          />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography sx={{ color: "text.primary", margin: "0 0 10px 0" }}>
            <Trans>Title</Trans>
          </Typography>
          <FilledTextField onChange={(value: string) => handleValueChange(value, "title")} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography sx={{ color: "text.primary", margin: "0 0 10px 0" }}>
            <Trans>URL</Trans>
          </Typography>
          <FilledTextField multiline onChange={(value: string) => handleValueChange(value, "url")} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography sx={{ color: "text.primary", margin: "0 0 10px 0" }}>
            <Trans>Proposal Type</Trans>
          </Typography>

          <SelectProposalType ref={ref} governanceId={governanceId} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Flex justify="space-between">
            <Typography sx={{ color: "text.primary", margin: "0 0 10px 0" }}>
              <Trans>Summary</Trans>
              <Typography component="span" fontSize="12px">
                <Trans>(supports markdown)</Trans>
              </Typography>
            </Typography>

            <Flex gap="0 5px">
              <Typography
                sx={{ color: "text.primary", cursor: "pointer", userSelect: "none" }}
                onClick={() => setPreview(!preview)}
              >
                <Trans>Preview</Trans>
              </Typography>
              {preview ? (
                <EyeOff style={{ cursor: "pointer" }} size="14px" onClick={() => setPreview(false)} />
              ) : (
                <Eye style={{ cursor: "pointer" }} size="14px" onClick={() => setPreview(true)} />
              )}
            </Flex>
          </Flex>

          <Box mt="10px">
            {preview && values.summary ? (
              <Box
                sx={{
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.background.level4}`,
                  padding: "10px",
                }}
              >
                <BaseMarkdown content={values.summary} />
              </Box>
            ) : (
              <Markdown
                defaultValue={values.summary}
                onChange={(value: string) => handleValueChange(value, "summary")}
              />
            )}
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          disabled={!!error || loading}
          onClick={handleMakeProposal}
          startIcon={loading ? <CircularProgress color="inherit" size={24} /> : null}
        >
          {error ?? <Trans>Make proposal</Trans>}
        </Button>
      </Flex>
    </Modal>
  );
}
