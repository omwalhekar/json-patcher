import findLast from "lodash/findLast";
import { areEqual, getValueType } from "../../helpers/common";
import TestTag from "../TestTag";
import ValueWrapper from "../ValueWrapper";

const JsonPair = (props: {
  basePath: string;
  level: number;
  keyName: string;
  value: any;
  jsonPatch: any;
  newPair?: boolean;
  updateJsonData: any;
  markPatchAsCancelled: any;
}) => {
  const {
    basePath,
    level,
    keyName,
    value,
    jsonPatch,
    newPair,
    updateJsonData,
    markPatchAsCancelled,
  } = props;

  const keyPath = `${basePath}/${keyName}`;
  const currentPatch = findLast(jsonPatch, { path: keyPath });
  const currentValueType = getValueType(value);
  const newValueType = getValueType(currentPatch?.value);
  const isSameValue = areEqual(value, currentPatch?.value);
  const testPassed = isSameValue && currentPatch?.op === "test";

  return (
    <div className={`json-pair`}>
      <span
        className={`json-key 
        ${currentPatch?.op === "add"  && !currentPatch?.cancelled ? "to-be-added" : ""} 
        ${currentPatch?.op === "delete" ? "to-be-deleted" : ""}`}
        onClick={() => {
          if (!isSameValue && currentPatch?.op === "delete") {
            updateJsonData(currentPatch);  
          } else {
            updateJsonData(currentPatch);
          }
          markPatchAsCancelled(currentPatch);
        }}
      >
        "{keyName}" :
      </span>

      <div
        className={`json-value ${
          !isSameValue &&
          !currentPatch?.cancelled &&
          currentPatch?.op === "replace"
            ? "to-be-replaced"
            : ""
        }
       
                ${currentPatch?.op === "add" && !currentPatch?.cancelled  ? "to-be-added" : ""} 
                ${
                  !isSameValue &&
                  !currentPatch?.cancelled &&
                  currentPatch?.op === "delete"
                    ? "to-be-deleted"
                    : ""
                }`}
        onClick={() => {
          if (currentPatch) {
            if (!isSameValue && ["replace"].includes(currentPatch?.op)) {
              updateJsonData();
            } else {
              updateJsonData(currentPatch);
            }
            markPatchAsCancelled(currentPatch);
          }
        }}
      >
      
        <ValueWrapper 
                valueType={currentValueType} 
                value={value} 
                path={`${basePath}/${keyName}`}
                level={level + 1}
              /> 
      </div>

      
      {
         currentPatch?.op === "test" && <TestTag result={testPassed}/>
      }

      {!newPair &&
        currentPatch?.op === "replace" &&
        !currentPatch?.cancelled &&
        !isSameValue && (
          <span
            className="replaced-value"
            onClick={() => updateJsonData(currentPatch)}
          >
             <ValueWrapper 
                valueType={newValueType} 
                value={currentPatch?.value} 
                path={`${basePath}/${keyName}`}
                level={level + 1}
              /> 
          </span>
        )}
    </div>
  );
};

export default JsonPair;
