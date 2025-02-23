import { useState } from "react";

import { TransactionsEntry } from "./TransactionsEntry";
import { SwapTransactionsModal } from "./TransactionsModal";

export function SwapTransactions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TransactionsEntry onClick={() => setOpen(true)} />

      {open ? <SwapTransactionsModal open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
