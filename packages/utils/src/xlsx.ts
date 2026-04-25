import { utils, writeFile } from "xlsx";

/** Writes one worksheet of JSON rows to `{fileName}.xlsx`. */
export function writeFileOneSheet(data: any[], fileName: string, sheetName = "Sheet") {
  const sheet = utils.json_to_sheet(data);

  const wb = utils.book_new();
  utils.book_append_sheet(wb, sheet, sheetName);
  writeFile(wb, `${fileName}.xlsx`);
}

export type MultipleSheetArgs = {
  data: any[];
  sheetName: string;
};

/** Writes multiple worksheets to a single `{fileName}.xlsx` file. */
export function writeFileMultipleSheet(data: MultipleSheetArgs[], fileName: string) {
  const wb = utils.book_new();

  data.forEach((ele) => {
    const sheet = utils.json_to_sheet(ele.data);
    utils.book_append_sheet(wb, sheet, ele.sheetName);
  });

  writeFile(wb, `${fileName}.xlsx`);
}
