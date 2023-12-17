import { find, findLast } from "lodash";
import { applyPatchToArray, areEqual, getValueType } from "../../helpers/common";
import TestTag from "../TestTag";
import ValueWrapper from "../ValueWrapper";

function countSlashes(path: string) {
  // Split the path string by "/"
  var slashesArray = path.split("/");

  // Count the number of elements in the array (excluding empty elements)
  // and subtract 1 to get the number of slashes
  var numberOfSlashes = slashesArray.filter(Boolean).length;
  return numberOfSlashes;
}

const ArrayWrapper = (props: {
  array: any;
  jsonPatch: any;
  path: string;
  level: number;
  updateJsonData: (patch: any) => void;
  markPatchAsCancelled: any;
}) => {
  const { array, jsonPatch, level, path, updateJsonData, markPatchAsCancelled } =
    props;
 
  const regexPattern = new RegExp(`^${path}(?:\/\\d+)?$`);
  let itemsToAdd:any = [];
  let itemsToReplace:any = [];
  jsonPatch.forEach((patch:any) => {
     if(regexPattern.test(patch.path) && !patch?.cancelled)
     {
      const pathParts = patch.path.split("/");
      const pathIndex = pathParts[pathParts.length - 1];
      if(patch.op === "add"){
        itemsToAdd.push({...patch, index: pathIndex})
      }
      if(patch.op === "replace"){
        itemsToReplace.push({...patch, index: pathIndex})
      }   
    }
  });

  const updatedArray = applyPatchToArray(array, itemsToAdd)
  
  return (
    <div className="json-wrapper">
      <span className="enclosing-bracket">{"["}</span>
        <div className="bracket-container">
            {updatedArray.map((item:any, index:number) => {
                return (
                    <ArrayPair 
                      index={index} 
                      path={`${path}/${index}`} 
                      level={level}
                      arrayItemValue={item} 
                      jsonPatch={jsonPatch} 
                      newPair={Boolean(find(itemsToAdd, {value: item}))}
                      replacePair={find(itemsToReplace, {value: item})}
                      updateJsonData={updateJsonData}
                      markPatchAsCancelled={markPatchAsCancelled}
                    />
                );
            })}
      </div>
      <span className="enclosing-bracket">{"]"}</span>
    </div>
  );
};

export default ArrayWrapper;


const ArrayPair = (props: {
    index:number, 
    arrayItemValue:any,
    path:string, 
    jsonPatch:any, 
    level: number,
    newPair?:boolean, 
    replacePair?:boolean, 
    updateJsonData:any
    markPatchAsCancelled:any
  }) => {
    const {index, arrayItemValue, path, level, jsonPatch, newPair, replacePair, updateJsonData, markPatchAsCancelled } = props;
    const currentPatch = findLast(jsonPatch, { path }) || findLast(jsonPatch, {op: "add", value: arrayItemValue});
    const isSameValue = areEqual(arrayItemValue, currentPatch?.value);
    const testPassed = isSameValue && currentPatch?.op === "test";
    const currentValueType = getValueType(arrayItemValue);
    const newValueType = getValueType(currentPatch?.value);

    return <div className={`array-item-pair
        ${newPair && currentPatch?.op === "add" && !currentPatch?.cancelled   ? "to-be-added":""} 
        ${currentPatch?.op === "delete"
            && !currentPatch?.cancelled  
            && !isSameValue ? "to-be-deleted" : ""}`}
            onClick={() => {
              if(currentPatch?.op === "add" && !currentPatch?.cancelled)
              { 
               updateJsonData(currentPatch)
               markPatchAsCancelled(currentPatch)
              }
             
            }}
          >
        <div className="array-index">"{index}":</div>
        <div className={`array-value 
          ${(currentPatch?.op === "replace" || replacePair) && 
          !currentPatch?.cancelled && !isSameValue? "to-be-replaced":""}`}
          onClick={() => {
           if(!currentPatch?.cancelled && currentPatch?.op === "replace")
           { 
            updateJsonData()
            markPatchAsCancelled(currentPatch)}
          }}
          > 
           <ValueWrapper 
                valueType={currentValueType} 
                value={arrayItemValue} 
                path={path}
                level={level + 1}
                updateJsonData={updateJsonData}
                jsonPatch={jsonPatch}
                markPatchAsCancelled={markPatchAsCancelled}
              />   
        </div>

         
      {
         currentPatch?.op === "test" && <TestTag result={testPassed}/>
      }
        
        {!isSameValue && !currentPatch?.cancelled && currentPatch?.op === "replace" && 
            <div className="to-be-added" onClick={() => {
              if((!currentPatch?.cancelled || newPair) && !currentPatch?.cancelled){
                updateJsonData(currentPatch)
                markPatchAsCancelled(currentPatch)
              }
            }}> 
            <ValueWrapper 
                valueType={newValueType} 
                value={currentPatch?.value} 
                path={path}
                level={level + 1}
                updateJsonData={updateJsonData}
                jsonPatch={jsonPatch}
                markPatchAsCancelled={markPatchAsCancelled}
              />
            </div>
        }
    </div>
}