import { Flex } from "@icpswap/ui";
import { AvatarImage } from "components/Image";
import { Typography } from "components/Mui";
import { ArrowRight } from "react-feather";

interface TransactionEventUIProps {
  amount: string | undefined;
  logo0: string;
  logo1: string;
  tokenLogo: string | undefined;
  onClick?: () => void;
}

export function TransactionEventUI({ logo0, logo1, tokenLogo, amount, onClick }: TransactionEventUIProps) {
  return (
    <Flex gap="0 10px" onClick={onClick} sx={{ cursor: "pointer" }}>
      <Flex gap="0 4px">
        <AvatarImage src={logo0} sx={{ width: "16px", height: "16px", borderRadius: "4px" }} />
        <ArrowRight size={14} />
        <AvatarImage src={logo1} sx={{ width: "16px", height: "16px", borderRadius: "4px" }} />
      </Flex>

      <Flex gap="0 4px">
        <AvatarImage src={tokenLogo} sx={{ width: "16px", height: "16px" }} />
        <Typography sx={{ fontSize: "12px" }}>{amount}</Typography>
      </Flex>
    </Flex>
  );
}
