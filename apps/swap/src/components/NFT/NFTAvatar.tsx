import LazyImage from "components/LazyImage";
import FileImage from "./FileImage";
import { type NFTTokenMetadata } from "@icpswap/types";
import NFTVideo from "./NFTVideo";

export default function NFTAvatar({
  metadata,
  onClick,
  autoPlay,
}: {
  metadata: NFTTokenMetadata | undefined;
  onClick?: () => void;
  autoPlay?: boolean;
}) {
  // fix wrong fileType in data
  // canister in rgm6h-oyaaa-aaaan-qcx5a-cai all file type is image but is video in data
  const fileType = metadata?.cId === "rgm6h-oyaaa-aaaan-qcx5a-cai" ? "image" : metadata?.fileType;

  return !!metadata && fileType === "video" ? (
    <NFTVideo src={metadata.filePath} onClick={onClick} autoPlay={autoPlay} />
  ) : (
    <LazyImage
      src={metadata?.filePath ?? ""}
      showDefault={fileType !== "image"}
      CustomImage={fileType !== "image" && !!fileType ? <FileImage fileType={fileType ?? ""} /> : null}
      onClick={onClick}
      boxSX={{
        cursor: "pointer",
      }}
    />
  );
}
