/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
/* eslint-disable guard-for-in */

import { Type } from "@dfinity/candid/lib/cjs/idl";
import { IDL } from "@dfinity/candid";
import { hexToBytes } from "@icpswap/utils";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export function idlTypeFormat(idType: Type) {
  if ("_fields" in idType) {
    const fields = idType._fields as any[];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const val = field[1];

      if (val instanceof IDL.RecClass || val instanceof IDL.VecClass || val instanceof IDL.OptClass) {
        if (val instanceof IDL.VecClass) {
          if (val["_type"] instanceof IDL.FixedNatClass && val["_type"]._bits === 8) {
            field[1] = new IDL.RecordClass({ "vec nat8 hex": new IDL.TextClass() });
          }
        }
      } else if (val instanceof IDL.RecordClass || val instanceof IDL.VariantClass || val instanceof IDL.TupleClass) {
        idlTypeFormat(val);
      }
    }
  }

  return idType;
}

export function actionArgsFormat(args: any) {
  if (isObject(args) && !isArray(args)) {
    const _args = {};

    for (const key in args) {
      if (key === "vec nat8 hex") {
        return hexToBytes(args[key]);
      }

      _args[key] = actionArgsFormat(args[key]);
    }

    return _args;
  }

  if (isArray(args)) {
    const _args: any[] = [];

    for (let i = 0; i < args.length; i++) {
      if (args[i] && args[i]._isPrincipal) {
        _args.push(args[i]);
      } else {
        _args.push(actionArgsFormat(args[i]));
      }
    }

    return _args;
  }

  return args;
}
