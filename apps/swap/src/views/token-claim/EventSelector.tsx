import { FilledTextField } from "components/index";
import { useClaimEvents } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";

export default function EventSelector({
  onChange,
  value,
}: {
  value: string | undefined;
  onChange?: (eventId: string) => void;
}) {
  const { t } = useTranslation();
  const { result: claimEvents } = useClaimEvents(0, 10000);

  const menus = claimEvents?.content.map((ele) => {
    return {
      label: ele.claimEventName,
      value: ele.claimEventId,
    };
  });

  return (
    <FilledTextField
      select
      menus={menus}
      placeholder={t("claim.select.event")}
      onChange={(value: string) => {
        if (onChange) onChange(value);
      }}
      value={value}
    />
  );
}
