import { FilledTextField } from "components/index";
import { t } from "@lingui/macro";
import { useClaimEvents } from "@icpswap/hooks";

export default function EventSelector({
  onChange,
  value,
}: {
  value: string | undefined;
  onChange?: (eventId: string) => void;
}) {
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
      placeholder={t`Select claim event`}
      onChange={(value: string) => {
        if (onChange) onChange(value);
      }}
      value={value}
    />
  );
}
