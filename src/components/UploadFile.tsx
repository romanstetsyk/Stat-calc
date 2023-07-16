import { ChangeEvent, useRef, useSyncExternalStore } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { WorkBook, read, utils } from "xlsx";
import { dataStore } from "~/dataStore";
import { GridColumnName, GridRow } from "~/Types";

type FileRow = { [colName: `col${number}`]: unknown } & { __rowNum__: number };

const parse_wb = (wb: WorkBook) => {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  console.log("sheet");
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

  return { datasetId: nanoid(), newRows };
};

export const UploadFile = () => {
  console.log("UploadFile");
  const { overwriteRows } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );

  const ref = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleClick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const fileBuffer = await file.arrayBuffer();

    try {
      const wb = read(fileBuffer, { cellDates: true, dense: true });
      const fileRows = parse_wb(wb);
      overwriteRows(fileRows);
      toast({
        title: "Success",
        description: "File opened successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not load the file.",
        status: "error",
        duration: null,
        isClosable: true,
      });
    } finally {
      if (ref.current) {
        ref.current.value = "";
      }
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
