import { Box, Typography, CircularProgress, Checkbox, InputAdornment } from "@mui/material";
import { getSwapLifeCycle, refreshSNSBuyerTokens } from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { useState } from "react";
import { NumberFilledTextField, Modal } from "components/index";
import { type SNSSwapInitArgs, ResultStatus } from "@icpswap/types";
import { TokenInfo } from "types/index";
import { parseTokenAmount, toSignificant, principalToAccount, formatTokenAmount } from "@icpswap/utils";
import { ICP } from "constants/tokens";
import Button from "components/authentication/ButtonConnector";
import { useTips, TIP_ERROR, TIP_SUCCESS } from "hooks/useTips";
import { useTokenBalance } from "hooks/token/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { tokenTransfer } from "hooks/token/calls";
import { SnsSwapLifecycle } from "@icpswap/constants";

export interface ParticipateProps {
  swap_id: string | undefined;
  tokenInfo: TokenInfo | undefined;
  swapInitArgs: SNSSwapInitArgs | undefined;
  open: boolean;
  onClose: () => void;
  min_participant: bigint | undefined;
  max_participant: bigint | undefined;
}

export function Participate({
  open,
  onClose,
  tokenInfo,
  swap_id,
  swapInitArgs,
  min_participant,
  max_participant,
}: ParticipateProps) {
  const principal = useAccountPrincipal();

  const [amount, setAmount] = useState<string | number | null>(null);
  const [risk, setRisk] = useState<boolean>(false);
  const [participateLoading, setParticipateLoading] = useState(false);

  const { result: balance } = useTokenBalance(ICP.address, principal);

  const [openTip] = useTips();

  const handleParticipate = async () => {
    if (participateLoading || !principal || !amount || !swap_id || !swapInitArgs) return;

    setParticipateLoading(true);

    const swap_life_cycle_result = await getSwapLifeCycle(swap_id);

    if (!swap_life_cycle_result) {
      openTip(t`Get swap life cycle error.`, TIP_ERROR);
      return undefined;
    }

    const life_cycle = swap_life_cycle_result.lifecycle[0];

    if (life_cycle !== SnsSwapLifecycle.Open) {
      openTip(t`Wrong swap life cycle.`, TIP_ERROR);
      return undefined;
    }

    const to = principalToAccount(swap_id, principal.toString());

    console.log("to:", to);

    const {
      data: block_height,
      status,
      message,
    } = await tokenTransfer({
      from: principal.toString(),
      canisterId: ICP.address,
      to,
      amount: formatTokenAmount(amount, ICP.decimals),
      identity: true,
    });

    if (status === ResultStatus.ERROR) {
      openTip(message, TIP_ERROR);
      return;
    }

    console.log("block_height:", block_height);

    const confirmation_text = swapInitArgs.confirmation_text[0];

    const result = await refreshSNSBuyerTokens(swap_id, principal.toString(), confirmation_text);

    openTip("Participate successfully", TIP_SUCCESS);

    console.log("fresh result:", result);

    setParticipateLoading(false);
  };

  const handleAmountChange = (amount: number) => {
    setAmount(amount);
  };

  const handleMAX = () => {
    if (!balance) return;
    setAmount(parseTokenAmount(balance.minus(ICP.transFee), ICP.decimals).toString());
  };

  let error: boolean | string = false;

  if (!risk) error = t`Read the risk statement`;
  if (!amount) error = t`Enter the amount`;
  if (!!balance && !!amount && parseTokenAmount(balance.minus(ICP.transFee), ICP.decimals).isLessThan(amount))
    error = t`Insufficient Balance`;
  if (!!amount && !formatTokenAmount(amount, ICP.decimals).isGreaterThan(ICP.transFee))
    error = t`Amount must be greater than 0.0001 ICP`;
  if (
    !!amount &&
    min_participant !== undefined &&
    formatTokenAmount(amount, ICP.decimals).isLessThan(min_participant.toString())
  )
    error = t`Amount must be greater than ${parseTokenAmount(
      min_participant?.toString(),
      ICP.decimals,
    ).toFormat()} ICP`;
  if (
    !!amount &&
    max_participant !== undefined &&
    formatTokenAmount(amount, ICP.decimals).isGreaterThan(max_participant.toString())
  )
    error = t`Amount must be less than ${parseTokenAmount(max_participant?.toString(), ICP.decimals).toFormat()} ICP`;

  return (
    <Modal open={open} onClose={onClose} title={t`Participate`}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", margin: "0 0 10px 0", alignItems: "center" }}>
          <Typography>
            <Trans>Amount</Trans>
          </Typography>
          <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
            <Typography>
              <Trans>Balance:</Trans>
            </Typography>
            <Typography color="text.primary">
              {balance
                ? toSignificant(parseTokenAmount(balance, ICP.decimals).toString(), 8, { groupSeparator: "," })
                : "--"}
            </Typography>
          </Box>
        </Box>

        <NumberFilledTextField
          placeholder="Amount"
          value={amount ?? ""}
          numericProps={{
            thousandSeparator: true,
            decimalScale: ICP.decimals,
            allowNegative: false,
            maxLength: 100,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ cursor: "pointer" }} color="primary" onClick={handleMAX}>
                  MAX
                </Typography>
              </InputAdornment>
            ),
          }}
          onChange={handleAmountChange}
        />
      </Box>

      <Box sx={{ margin: "10px 0 0 0" }}>
        <Typography>
          <Trans>Transaction Fee(billed to source)</Trans>
        </Typography>
        <Typography>
          {parseTokenAmount(ICP.transFee, ICP.decimals).toFormat()} {ICP.symbol}
        </Typography>
      </Box>

      <Box sx={{ margin: "30px 0 0 0", display: "flex", gap: "0 10px" }}>
        <Checkbox
          checked={risk}
          onChange={({ target: { checked } }) => {
            setRisk(checked);
          }}
        />

        <Typography sx={{ cursor: "pointer", userSelect: "none", fontSize: "12px" }} onClick={() => setRisk(!risk)}>
          <Trans>
            I confirm my understanding of the responsibilities and risks associated with participation in this token
            swap.
          </Trans>
        </Typography>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Button variant="contained" onClick={handleParticipate} disabled={participateLoading || !!error} fullWidth>
          {participateLoading ? <CircularProgress color="inherit" size={22} sx={{ margin: "0 5px 0 0" }} /> : null}
          {error ? error : <Trans>Participate</Trans>}
        </Button>
      </Box>
    </Modal>
  );
}
