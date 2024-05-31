import { Box, makeStyles } from "components/Mui";
import { useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useCanisterCandidString, useCanisterCandidFromDidString, useNeuronSystemFunctions } from "@icpswap/hooks";
import { renderInput, IDL, InputBox } from "@dfinity/candid";
import { actionArgsFormat, idlTypeFormat } from "utils/sns/idlType";
import { Theme } from "@mui/material/styles";
import { ProposalAction } from "@icpswap/types";

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: "10px",
    "& .popup-form": {
      display: "flex",
      flexDirection: "column",
      gap: "10px 0",
    },
    "& label": {
      display: "block",
      margin: "0 0 5px 0",
    },
    "& label, & span": {
      display: "block",
      fontSize: "12px",
      color: theme.palette.text.secondary,
    },
    "& input, & select": {
      width: "100%",
      height: "32px",
      border: "none",
      outline: "none",
      borderRadius: "4px",
      color: "#ffffff",
      background: theme.palette.background.level4,
      padding: "0 5px",
    },
    "& input[type='checkbox']": {
      width: "auto",
      height: "fit-content",
    },
    "& span": {
      margin: "5px 0 0 0",
      display: "block",
      "&.status": {
        color: theme.palette.text.warning,
      },
    },
  },
}));

export interface SelectProposalTypeRef {
  submit: () => ProposalAction | undefined;
}
export interface SelectProposalTypeProps {
  governanceId: string | undefined;
}

export const SelectProposalType = forwardRef(({ governanceId }: SelectProposalTypeProps, ref) => {
  const classes = useStyles();
  const [inputBox, setInputBox] = useState<null | InputBox>(null);

  const renderRef = useRef();

  const { result: neuronFunctions } = useNeuronSystemFunctions(governanceId);
  const { result: candidString } = useCanisterCandidString(governanceId);
  const { result: candid } = useCanisterCandidFromDidString(governanceId, candidString);

  const submit = () => {
    if (inputBox && neuronFunctions) {
      try {
        const parse = inputBox.parse();
        const formattedArgs = actionArgsFormat(parse);

        if (
          formattedArgs &&
          formattedArgs.ExecuteGenericNervousSystemFunction &&
          formattedArgs.ExecuteGenericNervousSystemFunction.function_name &&
          formattedArgs.ExecuteGenericNervousSystemFunction.payload
        ) {
          const argFunctionName = Object.keys(formattedArgs.ExecuteGenericNervousSystemFunction.function_name)[0];
          const functionId = neuronFunctions.functions.find((func) => {
            return func.name === argFunctionName;
          })?.id;

          if (!functionId) return undefined;

          formattedArgs.ExecuteGenericNervousSystemFunction = {
            function_id: functionId,
            payload: formattedArgs.ExecuteGenericNervousSystemFunction.payload,
          };
        }

        return formattedArgs as ProposalAction;
      } catch (e) {
        console.error(e);
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      submit,
    }),
    [submit],
  );

  // const proposalTypes = useMemo(() => {
  //   if (!candidString) return undefined;

  //   const string0 = candidString.split("const Action = IDL.Variant({")[1];
  //   const string1 = string0.split("});")[0];
  //   const string2 = string1
  //     .replace(/\s/g, "")
  //     .replace(/[(){}.]*/g, "")
  //     .replace(/:[\d\w]{0,},/g, ",")
  //     .replace(/'/g, "");

  //   const proposalTypes = string2.split(",").filter((e) => !!e);

  //   return proposalTypes;
  // }, [candidString]);

  const parseCandid = (candid: any) => {
    let fields: any;

    const keys = Object.keys(candid);

    const rebaseFields = (name: "origin" | "command" | "MakeProposal" | "action", _fields: any[]) => {
      if (name === "origin") {
        for (let i = 0; i < _fields.length; i++) {
          const _field = _fields[i];

          const fieldName = _field[0];

          if (fieldName === "command") {
            const val = _field[1];

            if ("_type" in val) {
              const __type = val._type;
              if ("_fields" in __type) {
                const __fields = __type._fields;
                rebaseFields("command", __fields);
              }
            }
            break;
          }
        }
      }

      if (name === "command") {
        for (let i = 0; i < _fields.length; i++) {
          const _field = _fields[i];
          const fieldName = _field[0];

          if (fieldName === "MakeProposal") {
            const val = _field[1];

            if ("_fields" in val) {
              const __fields = val._fields;
              rebaseFields("MakeProposal", __fields);
            }
            break;
          }
        }
      }

      if (name === "MakeProposal") {
        for (let i = 0; i < _fields.length; i++) {
          const _field = _fields[i];
          const fieldName = _field[0];

          if (fieldName === "action") {
            const val = _field[1];

            if ("_type" in val) {
              const __type = val._type;
              if ("_fields" in __type) {
                fields = __type;
              }
            }

            break;
          }
        }
      }
    };

    for (let i = 0; i < keys.length; i++) {
      const item = candid[keys[i]].argTypes[0];

      if (item) {
        if ("_fields" in item && item._fields.length > 0) {
          rebaseFields("origin", item._fields);
        }
      }
    }

    return fields;
  };

  const makeProposalFields = useMemo(() => {
    if (!candid || !neuronFunctions) return undefined;

    const args = parseCandid(candid);

    const functionIds = {};
    neuronFunctions.functions.forEach((func) => {
      if (func.id >= 1000) {
        functionIds[func.name] = new IDL.RecordClass();
      }
    });

    const _fieldName = "function_name";
    const _fieldValue = IDL.Variant(functionIds);

    Object.keys(args._fields).forEach((key) => {
      const item = args._fields[key];

      if (
        item[0] === "ExecuteGenericNervousSystemFunction" &&
        item[1] &&
        item[1]._fields &&
        item[1]._fields[0] &&
        item[1]._fields[0][0] === "function_id" &&
        item[1]._fields[0][1] instanceof IDL.FixedNatClass
      ) {
        args._fields[key][1]._fields[0] = [_fieldName, _fieldValue];
      }
    });

    // Format "ExecuteGenericNervousSystemFunction" payload VecClass to hex string
    return idlTypeFormat(args);
  }, [candid, neuronFunctions]);

  useEffect(() => {
    if (makeProposalFields && renderRef && renderRef.current) {
      const inputBox = renderInput(makeProposalFields);
      inputBox.render(renderRef.current);
      setInputBox(inputBox);
    }
  }, [JSON.stringify(makeProposalFields), renderRef]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box ref={renderRef} className={classes.wrapper} />
    </Box>
  );
});
