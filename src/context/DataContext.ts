import { createContext } from 'react';

interface IDataContext {
    jsonPatch: any,
    updateJsonData:any,
    markPatchAsCancelled:any
}

const DataContext = createContext<IDataContext>({
    jsonPatch: {},
    updateJsonData: null,
    markPatchAsCancelled: null
});

export default DataContext;