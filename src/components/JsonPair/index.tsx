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

  const isAddOperation = currentPatch?.op === "add" && !currentPatch?.cancelled;
  const isDeleteOperation = currentPatch?.op === "delete";
  const isReplaceOperation =
    !isSameValue && !currentPatch?.cancelled && currentPatch?.op === "replace";

  const handleUpdateAndCancel = () => {
    if (currentPatch && currentPatch.op !== "test") {
      updateJsonData(currentPatch);
      markPatchAsCancelled(currentPatch);
    }
  };

  return (
    <div className="json-pair">
      <span
        className={`json-key ${isAddOperation ? "to-be-added" : ""} ${
          isDeleteOperation ? "to-be-deleted" : ""
        }`}
        onClick={handleUpdateAndCancel}
      >
        "{keyName}" :
      </span>

      <div
        className={`json-value ${isReplaceOperation ? "to-be-replaced" : ""} ${
          isAddOperation ? "to-be-added" : ""
        } ${isDeleteOperation ? "to-be-deleted" : ""}`}
        onClick={handleUpdateAndCancel}
      >
        <ValueWrapper
          valueType={currentValueType}
          value={value}
          path={`${basePath}/${keyName}`}
          level={level + 1}
        />
      </div>

      {testPassed && <TestTag result={testPassed} />}

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
