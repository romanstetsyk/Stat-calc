import { ChangeEvent, useContext, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { WorkBook, read, utils } from "xlsx";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { GridColumnName, GridRow } from "~/Types";

type FileRow = { [colName: `col${number}`]: unknown } & { __rowNum__: number };

const parse_wb = (wb: WorkBook) => {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  console.log(sheet);
  const range = utils.decode_range(sheet["!ref"] ?? "A1");
  const headers = Array.from<unknown, GridColumnName>(
    { length: range.e.c - range.s.c + 1 },
    (_, i) => `col${i + 1 + range.s.c}`
  );
  const data = utils.sheet_to_json<FileRow>(sheet, {
    header: headers,
    blankrows: true,
  });

  const newRows: GridRow[] = [];
  data.forEach((row) => {
    const { __rowNum__, ...rest } = row;
    for (const col in rest) {
      rest[col as GridColumnName] = String(rest[col as GridColumnName]);
    }
    newRows[__rowNum__] = rest as GridRow;
  });

  return newRows;
};

export const UploadFile = () => {
  const { setRowData } = useContext(DataColumnsContext);
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    const fileRows = parse_wb(
      read(await e.target.files?.[0].arrayBuffer(), { cellDates: true })
    );

    setRowData(fileRows);

    if (ref.current) {
      ref.current.value = "";
    }
  };

  return (
    <>
      <Button onClick={() => ref.current?.click()}>Upload</Button>
      <input
        ref={ref}
        type="file"
        name="upload"
        multiple={false}
        onChange={handleClick}
        hidden
      />
    </>
  );
};
