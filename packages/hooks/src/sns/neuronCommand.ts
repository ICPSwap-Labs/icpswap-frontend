import type { Operation } from "@icpswap/types";

export function neuronOperationCommand(operation: Operation): [] | [{ Configure: { operation: [] | [Operation] } }] {
  return [
    {
      Configure: {
        operation: [operation],
      },
    },
  ];
}
