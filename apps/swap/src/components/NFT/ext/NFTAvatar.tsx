import LazyImage from "components/LazyImage";

export interface NFTAvatarProps {
  image: string | undefined;
}

export function NFTAvatar({ image }: NFTAvatarProps) {
  return (
    <LazyImage
      src={image ?? ""}
      boxSX={{
        cursor: "pointer",
      }}
    />
  );
}
