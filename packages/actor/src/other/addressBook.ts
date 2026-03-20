import { AddressBookFactory, type AddressBookService } from "@icpswap/candid";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const addressBook = (identity?: true) =>
  actor.create<AddressBookService>({
    actorName: ActorName.AddressBook,
    idlFactory: AddressBookFactory,
    identity,
  });
