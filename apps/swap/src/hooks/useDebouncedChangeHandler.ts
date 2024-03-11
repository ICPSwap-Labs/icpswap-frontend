import { useCallback, useEffect, useRef, useState } from "react";

export default function useDebouncedChangeHandler<T>(
  value: T,
  onChange: (newValue: T) => void,
  debouncedMs = 100,
): [T, (value: T) => void] {
  const [inner, setInner] = useState<T>(() => value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const onChangeInner = useCallback(
    (newValue) => {
      setInner(newValue);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        onChange(newValue);
        timer.current = undefined;
      }, debouncedMs);
    },
    [debouncedMs, onChange],
  );

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
    setInner(value);
  }, [value]);

  return [inner, onChangeInner];
}
