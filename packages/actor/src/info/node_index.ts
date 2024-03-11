import { NodeIndex, NodeIndexInterfaceFactory } from "@icpswap/candid";
import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const node_index = () =>
  actor.create<NodeIndex>({
    actorName: ActorName.NodeIndex,
    idlFactory: NodeIndexInterfaceFactory,
  });
