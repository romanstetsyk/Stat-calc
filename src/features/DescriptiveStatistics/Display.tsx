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
import mean from "@stdlib/stats-base-mean";
import mediansorted from "@stdlib/stats-base-mediansorted";
import variance from "@stdlib/stats-base-variance";

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
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th></Th>
              <Th isNumeric>n</Th>
              <Th isNumeric>Mean</Th>
              <Th isNumeric>Median</Th>
              <Th isNumeric>S. Variance</Th>
              <Th isNumeric>P. Variance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(columns) &&
              columns.map((col) => {
                const arrOfNums = cols[col].filter(Number).map(Number);
                const n = arrOfNums.length;
                return (
                  <Tr key={col}>
                    <Td>{col}</Td>
                    <Td isNumeric>{n}</Td>
                    <Td isNumeric>{mean(n, arrOfNums, 1)}</Td>
                    <Td isNumeric>{mediansorted(n, arrOfNums, 1)}</Td>
                    <Td isNumeric>{variance(n, 1, arrOfNums, 1)}</Td>
                    <Td isNumeric>{variance(n, 0, arrOfNums, 1)}</Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Display;
