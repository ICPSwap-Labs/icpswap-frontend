import { ReactNode } from "react";
import { Link } from "@mui/material";

export default function ExternalLink({ label, value }: { label: ReactNode; value: string }) {
  return (
    <Link href={value} target="_blank">
      {label}
    </Link>
  );
}
