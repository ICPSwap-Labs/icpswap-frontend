import { Box } from "components/Mui";
import { useState } from "react";
import { TextField } from "@mui/material";

import { MakeProposalInput } from "./Input";

type Value = { [key: string]: string };

export interface MultipleInputProps {
  type?: string;
}

export function MultipleInput({ type }: MultipleInputProps) {
  const [numbers, setNumbers] = useState<number | undefined>(0);
  const [values, setValues] = useState<Value>({} as Value);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val: undefined | number = Number(event.target.value);
    if (val < 0) val = undefined;
    setNumbers(val);

    if (!val || val === undefined) {
      setValues({});
      return;
    }

    if (val < Object.keys(values).length) {
      const newValues = { ...values };

      Object.keys(values).forEach((key) => {
        if (Number(key) >= val!) {
          Reflect.deleteProperty(newValues, key);
        }
      });

      setValues(newValues);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    setValues((prevState) => ({
      ...prevState,
      [String(index)]: value,
    }));
  };

  return (
    <>
      <TextField value={numbers} sx={{ width: "120px" }} size="small" type="number" onChange={handleNumberChange} />

      {numbers && numbers > 0
        ? [...new Array(numbers).keys()].map((number) => (
            <Box key={number} sx={{ margin: "5px 0 0 0" }}>
              <MakeProposalInput type="principal" onChange={(value: string) => handleInputChange(value, number)} />
            </Box>
          ))
        : null}
    </>
  );
}
