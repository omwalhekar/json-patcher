import findLast from "lodash/findLast";
import JsonWrapper from "../JsonWrapper";
import { areEqual } from "../../helpers/common";

function getValueType(obj: any) {
  if (Array.isArray(obj)) return "Array";
  if (typeof obj === "object" && obj !== null) return "Object";
  return "String";
}

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

  console.log({currentPatch})
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
        "{keyName}":
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
        {currentValueType === "Object" ? (
          <JsonWrapper
            json={value}
            jsonPatch={jsonPatch}
            level={level + 1}
            path={`${basePath}/${keyName}`}
            updateJsonData={updateJsonData}
            markPatchAsCancelled={markPatchAsCancelled}
          />
        ) : (
          <span>{JSON.stringify(value)}</span>
        )}
      </div>
      {!newPair &&
        currentPatch?.op === "replace" &&
        !currentPatch?.cancelled &&
        !isSameValue && (
          <span
            className="replaced-value"
            onClick={() => updateJsonData(currentPatch)}
          >
            {newValueType === "Object" ? (
              <JsonWrapper
                json={currentPatch?.value}
                jsonPatch={jsonPatch}
                level={level + 1}
                path={`${basePath}/${keyName}`}
                updateJsonData={updateJsonData}
                markPatchAsCancelled={markPatchAsCancelled}
              />
            ) : (
              <span onClick={() => updateJsonData(currentPatch)}>
                {JSON.stringify(currentPatch?.value)}
              </span>
            )}
          </span>
        )}
    </div>
  );
};

export default JsonPair;
