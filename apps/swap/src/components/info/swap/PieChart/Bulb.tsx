import { useMediaQuery640 } from "hooks/theme";

export function Bulb() {
  const downMedia640 = useMediaQuery640();

  return (
    <img
      width={`${downMedia640 ? "16px" : "20px"}`}
      height={`${downMedia640 ? "16px" : "20px"}`}
      src="/images/icons/bulb.svg"
      alt=""
      style={{ position: "relative", top: downMedia640 ? "3px" : "0px" }}
    />
  );
}
