import { createContext } from 'react';

const UserContext = createContext<any>({
    json: {},
    jsonPatch: {},
    updateJsonData: null,
    setPatch:null
});

export default UserContext;