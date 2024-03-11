import Copy from "ui-component/copy/copy";
import { shorten } from "@icpswap/utils";

export default function AddressFormat({ address }: { address: string }) {
  return <Copy content={address}>{shorten(address, 8)}</Copy>;
}
