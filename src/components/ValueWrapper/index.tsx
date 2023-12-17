import ArrayWrapper from "../ArrayWrapper";
import JsonWrapper from "../JsonWrapper";

const ValueWrapper = (props: {valueType: string, value:any, path:string, level:number, jsonPatch:any, updateJsonData:any, markPatchAsCancelled:any}) => {
    const {valueType, value, path, level,jsonPatch, updateJsonData, markPatchAsCancelled} = props;
    return  valueType === "Object"? 
    <JsonWrapper 
      json={value} 
      jsonPatch={jsonPatch} 
      path={path} 
      level={level + 1} 
      updateJsonData={updateJsonData} 
      markPatchAsCancelled={markPatchAsCancelled} 
      /> :
      valueType === "Array"? 
    <ArrayWrapper 
      array={value} 
      jsonPatch={jsonPatch} 
      path={path} 
      level={level + 1} 
      updateJsonData={updateJsonData} 
      markPatchAsCancelled={markPatchAsCancelled} />:
    
    <>"{value}"</>
  }

export default ValueWrapper;