export function explorerLink(id: string) {
  if (id.length > 27) {
    return `https://icscan.io/principal/${id}`;
  }

  return `https://dashboard.internetcomputer.org/canister/${id}`;
}
