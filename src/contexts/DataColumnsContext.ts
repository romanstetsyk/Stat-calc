import { createContext } from "react";
import { ColumnValues } from "../Types";

export const DataColumnsContext = createContext<ColumnValues>({});
