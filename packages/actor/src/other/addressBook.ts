import { AddressBookFactory, AddressBookService } from "@icpswap/candid";

import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const addressBook = (identity?: true) =>
  actor.create<AddressBookService>({
    actorName: ActorName.AddressBook,
    idlFactory: AddressBookFactory,
    identity,
  });
