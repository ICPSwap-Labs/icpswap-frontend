import { describe, expect, it } from "vitest";

import { encodePrincipalToEthAddress } from "./ckETH";
import { Principal } from "./ic";

describe("encodePrincipalToEthAddress", () => {
  it("encodePrincipalToEthAddress result to be equal", () => {
    const res = encodePrincipalToEthAddress(
      Principal.fromText("r7p6d-gn5kz-lwupk-nt46b-57kfb-kodsd-ouzrz-x7skf-gmt4i-7q574-fqe"),
    );
    expect(res).toBe("0x1dbd56576a3d4d9f3c1efd450a9c390dd4cc737fc9453327c47e1dff0b020000");
  });
});
