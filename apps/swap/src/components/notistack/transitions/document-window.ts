export function ownerDocument(node: Node | null | undefined): Document {
  return node?.ownerDocument || document;
}

export function ownerWindow(node: Node | null): Window {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}
