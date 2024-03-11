export function enumToString(type: any): string {
  if (typeof type === "string") return type;

  if (typeof type === "object") {
    if (type) {
      return Object.keys(type)[0];
    }
  }

  return type as string;
}
