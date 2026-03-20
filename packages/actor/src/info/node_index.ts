import { type NodeIndex, NodeIndexInterfaceFactory } from "@icpswap/candid";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const node_index = () =>
  actor.create<NodeIndex>({
    actorName: ActorName.NodeIndex,
    idlFactory: NodeIndexInterfaceFactory,
  });
