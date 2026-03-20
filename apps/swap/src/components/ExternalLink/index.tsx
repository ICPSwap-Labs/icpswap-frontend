import { Link } from "components/Mui";
import type { ReactNode } from "react";

export default function ExternalLink({ label, value }: { label: ReactNode; value: string }) {
  return (
    <Link href={value} target="_blank">
      {label}
    </Link>
  );
}
