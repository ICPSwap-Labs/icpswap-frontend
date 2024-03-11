export function isImage(fileType: string): boolean {
  return !!fileType.match("image.*");
}

export function isVideo(fileType: string): boolean {
  return !!fileType.match("video.*");
}

export function isAudio(fileType: string): boolean {
  return !!fileType.match("audio.*");
}

export function isJSON(fileType: string): boolean {
  return fileType === "application/json";
}

export function isPDF(fileType: string): boolean {
  return fileType === "application/pdf";
}

export function isText(fileType: string): boolean {
  return fileType === "text/plain";
}

export function isJavascript(fileType: string): boolean {
  return fileType === "text/javascript";
}

export function isExcel(fileType: string): boolean {
  return (
    fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileType === "application/vnd.ms-excel"
  );
}

export function isDoc(fileType: string): boolean {
  return (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  );
}

export function getFileType(fileType: string): string {
  if (isImage(fileType)) return "image";
  if (isVideo(fileType)) return "video";
  if (isAudio(fileType)) return "audio";

  if (
    isJSON(fileType) ||
    isPDF(fileType) ||
    isText(fileType) ||
    isJavascript(fileType) ||
    isExcel(fileType) ||
    isDoc(fileType)
  )
    return "other";

  return "unKnow";
}

export function isValidUrl(urlString: string): boolean {
  const reg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/);
  return reg.test(urlString);
}
