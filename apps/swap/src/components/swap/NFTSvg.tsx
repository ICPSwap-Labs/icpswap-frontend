import LazyImage from "components/LazyImage";
import { usePositionNFTSvg } from "hooks/swap/useNFTSvg";

export interface NFTSvgProps {
  tokenId: string | number | bigint | undefined;
  version?: "v2" | "v3";
}

export default function NFTSvg({ tokenId }: NFTSvgProps) {
  const svg = usePositionNFTSvg(tokenId);

  return <LazyImage src={svg ?? ""} />;
}
