import { Trans, t } from "@lingui/macro";
import { useNeuronSystemFunctions, useNeuron } from "@icpswap/hooks";
import { Flex, Modal } from "@icpswap/ui";
import { Copy } from "components/index";
import { Button, Box, Typography, Collapse, Checkbox } from "components/Mui";
import { Neuron, NervousSystemFunction } from "@icpswap/types";
import { useCallback, useMemo, useState } from "react";
import { BigNumber, shorten, toHexString } from "@icpswap/utils";
import { ChevronDown } from "react-feather";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";

import { AddFolloweeModal } from "./AddFolloweeModal";
import { DeleteFolloweeModal } from "./DeleteFolloweeModal";
import { AddFollowee } from "./AddFollowee";
import { DeleteFollowee } from "./DeleteFollowee";

interface FollowNeuronProps {
  func: NervousSystemFunction;
  neuron_id: Uint8Array | number[] | undefined;
  governance_id: string | undefined;
  neuron: Neuron | undefined;
  refreshNeuron: () => void;
  onCheckChange: (checked: boolean, func_id: bigint) => void;
  checkedFunc: bigint[];
}

function FollowNeuron({
  neuron,
  checkedFunc,
  func,
  neuron_id,
  governance_id,
  refreshNeuron,
  onCheckChange,
}: FollowNeuronProps) {
  const [open, setOpen] = useState(false);

  const following = useMemo(() => {
    if (!neuron) return undefined;

    return neuron.followees
      .filter(([id]) => id === func.id)
      .map(([, followees]) => followees.followees)
      .flat();
  }, [neuron, func]);

  const handleRefreshNeuron = () => {
    refreshNeuron();
  };

  const handleCheckChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onCheckChange(checked, func.id);
    },
    [func, onCheckChange],
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          color: "text.primary",
        }}
        onClick={() => setOpen(!open)}
      >
        <Flex gap="0 10px">
          <Checkbox
            checked={checkedFunc.includes(func.id)}
            onClick={(event) => event.stopPropagation()}
            onChange={handleCheckChange}
          />
          <Typography color="text.primary">{func.name}</Typography>
        </Flex>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0 5px",
          }}
        >
          <Typography color="text.primary">{following?.length ?? "0"}</Typography>
          <ChevronDown style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "all 300ms" }} />
        </Box>
      </Box>

      <Collapse appear={false} in={open}>
        <Box sx={{ margin: "10px 0 0 0" }}>
          <Box>
            <Typography sx={{ fontSize: "12px" }} lineHeight="16px">
              {func.description}
            </Typography>
          </Box>

          {following && following.length > 0 ? (
            <Box sx={{ margin: "20px 0 0 0" }}>
              <Typography>
                <Trans>Current Following</Trans>
              </Typography>

              <Box sx={{ margin: "10px 0 0 0" }}>
                {following?.map((follow) => (
                  <Box
                    key={toHexString(follow.id)}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                      <Typography>{shorten(toHexString(follow.id), 8)}</Typography>
                      <Copy content={toHexString(follow.id)}>
                        <CopyIcon />
                      </Copy>
                    </Box>

                    <DeleteFollowee
                      neuron_id={neuron_id}
                      governance_id={governance_id}
                      neuron={neuron}
                      func_id={func.id}
                      follow_id={follow.id}
                      onDeleteSuccess={handleRefreshNeuron}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}

          <Box sx={{ display: "flex", justifyContent: "center", margin: "30px 0 0 0" }}>
            <AddFollowee
              neuron={neuron}
              func_id={func.id}
              neuron_id={neuron_id}
              governance_id={governance_id}
              onFollowSuccess={handleRefreshNeuron}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export interface FollowingProps {
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  disabled?: boolean;
}

export function Followings({ governance_id, neuron_id, disabled }: FollowingProps) {
  const [open, setOpen] = useState(false);
  const [addFolloweeOpen, setAddFolloweeOpen] = useState(false);
  const [deleteFolloweeOpen, setDeleteFolloweeOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [checkedFunc, setCheckedFunc] = useState<bigint[]>([]);

  const { result: neuron_system_functions } = useNeuronSystemFunctions(governance_id);
  const { result: neuron } = useNeuron(governance_id, neuron_id, refreshTrigger);

  const handleCheckAll = useCallback(() => {
    if (!neuron_system_functions) return;
    const func_ids = neuron_system_functions.functions.map((e) => e.id);

    if (func_ids.length === checkedFunc.length) {
      setCheckedFunc([]);
      return;
    }

    setCheckedFunc([...func_ids]);
  }, [neuron_system_functions, checkedFunc]);

  const handleCheckChange = useCallback(
    (checked: boolean, func_id: bigint) => {
      if (checked) {
        setCheckedFunc([...new Set([...checkedFunc, func_id])]);
      } else {
        const index = checkedFunc.findIndex((e) => e === func_id);
        if (index !== -1) {
          const __checkedFunc = [...checkedFunc];
          __checkedFunc.splice(index, 1);
          setCheckedFunc([...__checkedFunc]);
        }
      }
    },
    [checkedFunc],
  );

  const handleAddFollowee = useCallback(() => {
    if (checkedFunc.length === 0) return;
    setAddFolloweeOpen(true);
  }, [checkedFunc]);

  const handleDeleteFollowee = useCallback(() => {
    if (checkedFunc.length === 0) return;
    setDeleteFolloweeOpen(true);
  }, [checkedFunc]);

  const isSelectedAll = useMemo(() => {
    if (!neuron_system_functions) return false;
    return neuron_system_functions.functions.length === checkedFunc.length;
  }, [neuron, checkedFunc]);

  const disableDeleteFollowee = useMemo(() => {
    if (!isSelectedAll || !neuron) return false;

    const followeesCount = neuron.followees
      .reduce((prev, curr) => {
        return prev.plus(curr[1].followees.length);
      }, new BigNumber(0))
      .toNumber();

    return followeesCount === 0;
  }, [isSelectedAll, neuron]);

  return (
    <Box>
      <Typography color="text.primary" fontSize="16px" fontWeight={600}>
        <Trans>Following</Trans>
      </Typography>

      <Typography fontSize="12px" sx={{ margin: "10px 0 0 0", lineHeight: "16px" }}>
        <Trans>
          Following allows you to delegate your votes to another neuron holder. You still earn rewards if you delegate
          your voting rights. You can change your following at any time.
        </Trans>
      </Typography>

      <Button
        sx={{ margin: "10px 0 0 0" }}
        onClick={() => setOpen(true)}
        variant="contained"
        size="small"
        disabled={disabled}
      >
        <Trans>Following</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Follow neurons`}>
        <Typography fontSize="12px" lineHeight="16px">
          <Trans>
            Follow neurons to automate your voting, and receive the maximum voting rewards. You can follow neurons on
            specific topics or all topics.
          </Trans>
        </Typography>

        <Flex justify="flex-end" sx={{ margin: "20px 0 0 0" }} gap="0 10px">
          <Typography color="text.theme-secondary" sx={{ cursor: "pointer" }} onClick={handleCheckAll}>
            {isSelectedAll ? <Trans>Cancel</Trans> : <Trans>Select All</Trans>}
          </Typography>
        </Flex>

        <Box
          sx={{
            margin: "30px 0 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "20px 0",
            maxHeight: "380px",
            overflow: "auto",
          }}
        >
          {neuron_system_functions?.functions.map((func) => (
            <FollowNeuron
              key={func.id.toString()}
              func={func}
              neuron_id={neuron_id}
              governance_id={governance_id}
              neuron={neuron}
              refreshNeuron={() => setRefreshTrigger(refreshTrigger + 1)}
              onCheckChange={handleCheckChange}
              checkedFunc={checkedFunc}
            />
          ))}
        </Box>

        {isSelectedAll ? (
          <Flex fullWidth gap="0 24px" justify="center" margin="32px 0 0 0">
            <Button
              fullWidth
              size="large"
              sx={{ height: "48px" }}
              variant="outlined"
              onClick={handleDeleteFollowee}
              disabled={disableDeleteFollowee}
            >
              <Trans>Delete Followee</Trans>
            </Button>
            <Button fullWidth size="large" sx={{ height: "48px" }} variant="contained" onClick={handleAddFollowee}>
              <Trans>Add Followee</Trans>
            </Button>
          </Flex>
        ) : null}
      </Modal>

      <AddFolloweeModal
        open={addFolloweeOpen}
        governance_id={governance_id}
        onClose={() => setAddFolloweeOpen(false)}
        onFollowSuccess={() => setRefreshTrigger(refreshTrigger + 1)}
        neuron={neuron}
        neuron_id={neuron_id}
        func_ids={checkedFunc}
      />

      <DeleteFolloweeModal
        open={deleteFolloweeOpen}
        onClose={() => setDeleteFolloweeOpen(false)}
        func_ids={checkedFunc}
        governance_id={governance_id}
        neuron={neuron}
        neuron_id={neuron_id}
        follow_ids="all"
        onDeleteSuccess={() => setRefreshTrigger(refreshTrigger + 1)}
      />
    </Box>
  );
}
