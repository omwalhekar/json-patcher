import findLast from "lodash/findLast";
import { areEqual, getValueType } from "../../helpers/common";
import TestTag from "../TestTag";
import ValueWrapper from "../ValueWrapper";
import { OpType } from "../../interfaces/common";

const JsonPair = (props: {
  basePath: string;
  level: number;
  keyName?: string;
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

  const isAddOperation = currentPatch?.op === OpType.Add && !currentPatch?.cancelled;
  const isDeleteOperation = currentPatch?.op === OpType.Remove;
  const isTestOperation = currentPatch?.op === OpType.Test;
  const isReplaceOperation =
    !isSameValue && !currentPatch?.cancelled && currentPatch?.op === OpType.Replace;

  const testPassed = isSameValue && isTestOperation;
  const handleUpdateAndCancel = () => {
    if (currentPatch && currentPatch.op !== OpType.Test) {
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

      {isTestOperation && <TestTag result={testPassed} />}

      {!newPair &&
        currentPatch?.op === OpType.Replace &&
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
