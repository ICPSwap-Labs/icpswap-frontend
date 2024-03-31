import copyToClipboard from "copy-to-clipboard";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { useTips, TIP_SUCCESS } from "hooks/useTips";

export interface CopyProps {
  content: string | undefined | null;
}

export function Copy({ content }: CopyProps) {
  const [openTips] = useTips();

  const handleCopy = () => {
    if (!content) return;
    copyToClipboard(content);
    openTips("Copy Success", TIP_SUCCESS);
  };

  return <CopyIcon onClick={handleCopy} style={{ cursor: "pointer" }} />;
}
