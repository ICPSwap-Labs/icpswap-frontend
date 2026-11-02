import { useDesignVersion, type DesignVersion } from "hooks/useDesignVersion";
import { Layout } from "react-feather";

export function DesignSwitch() {
  const { designVersion, setDesignVersion } = useDesignVersion();

  return (
    <label className="relative inline-flex shrink-0 items-center" title="Design version">
      <Layout
        className="pointer-events-none absolute left-2.5 z-10 text-base-content/65"
        size={16}
        aria-hidden="true"
      />
      <select
        aria-label="Design version"
        value={designVersion}
        onChange={(event) => setDesignVersion(event.target.value as DesignVersion)}
        className="select select-sm h-9 min-h-0 w-[155px] rounded-md border border-base-content/15 bg-base-100 py-0 pr-7 pl-9 text-xs font-medium text-base-content shadow-none max-[640px]:w-9 max-[640px]:px-0 max-[640px]:text-transparent max-[640px]:[background-image:none] [&>option]:text-base-content"
      >
        <option value="classic">Original design</option>
        <option value="modern">New design</option>
      </select>
    </label>
  );
}
