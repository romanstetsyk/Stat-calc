import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DisplayOptions, TFormSummary } from "./types";
import { ColumnValues } from "../../Types";

type IProps = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TFormSummary;
  cols: ColumnValues;
};

function Display({ setDisplay, formSummary, cols }: IProps) {
  const { columns } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>Edit</Button>
      {Array.isArray(columns) && columns.map((col) => <p key={col}>{col}</p>)}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th isNumeric>Mean</Th>
              <Th isNumeric>Median</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(columns) &&
              columns.map((col) => (
                <Tr key={col}>
                  <Td>{col}</Td>
                  <Td isNumeric>25.4</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Display;
