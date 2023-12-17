import { createContext } from "react";
import { IPatch } from "../interfaces/common";

interface IDataContext {
  jsonPatch: IPatch[];
  updateJsonData: any;
  markPatchAsCancelled: any;
}

const DataContext = createContext<IDataContext>({
  jsonPatch: [],
  updateJsonData: null,
  markPatchAsCancelled: null,
});

export default DataContext;
