import { ReactNode, useEffect, useState } from "react";
import CheckboxGroupContext from "./context";

export interface CheckboxGroupProps {
  defaultChecked?: string[];
  onChange?: (checked: string[]) => void;
  children: ReactNode;
}

export default function CheckboxGroup({ defaultChecked, onChange, children }: CheckboxGroupProps) {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (defaultChecked && defaultChecked.length) {
      setChecked(defaultChecked);
    }
  }, [defaultChecked]);

  const handleCheckChange = (checked: string[]) => {
    setChecked(checked);
    if (onChange) onChange(checked);
  };

  return (
    <CheckboxGroupContext.Provider value={{ checked, onChange: handleCheckChange }}>
      {children}
    </CheckboxGroupContext.Provider>
  );
}
