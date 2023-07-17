import { ChangeEvent, useRef, useState, useSyncExternalStore } from "react";
import { Button, Center, Spinner, useToast } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { WorkBook, read, utils } from "xlsx";
import { dataStore } from "~/dataStore";
import { GridTrack, GridTracks } from "~/Types";
import { createGridTrack } from "~/utils/createGridTrack";

type FileRow = { [n: number]: unknown } & { __rowNum__: number };

const parse_wb = (wb: WorkBook) => {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  console.log("sheet");
  const range = utils.decode_range(sheet["!ref"] ?? "A1");
  const headers = Array.from<unknown, `${number}`>(
    { length: range.e.c - range.s.c + 1 },
    (_, i) => `${i + range.s.c}`
  );
  const data = utils.sheet_to_json<FileRow>(sheet, {
    header: headers,
    // blankrows: true,
  });

  console.log("data", data);

  const newRows = createGridTrack<GridTracks>();
  data.forEach((row) => {
    const { __rowNum__, ...rest } = row;
    const newRow = createGridTrack<GridTrack>();
    for (const col in rest) {
      newRow[col] = String(rest[col]);
      newRow.length += 1;
    }

    newRows[__rowNum__] = newRow;
  });

  return { datasetId: nanoid(), newRows };
};

export const UploadFile = () => {
  console.log("UploadFile");
  const { overwriteRows } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleClick = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Center
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <Spinner
            id="asdf"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      )}
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
