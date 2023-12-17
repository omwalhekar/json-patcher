import { useContext } from "react";
import { checkIfPathIsArray, getValueType } from "../../helpers/common";
import JsonPair from "../JsonPair";
import DataContext from "../../context/DataContext";
import { IPatch, OpType } from "../../interfaces/common";

const countSlashes = (path: string) => path.split("/").filter(Boolean).length;

const JsonWrapper = (props: { json: any; path: string; level: number }) => {
  const { jsonPatch, updateJsonData, markPatchAsCancelled } =
    useContext(DataContext);
  const { json, level, path } = props;
  const keys = Object.keys(json);
  const isPathAnArray = checkIfPathIsArray;

  const keysToAdd = jsonPatch
    .filter(
      (patch: IPatch) =>
        countSlashes(patch?.path) === level &&
        patch.op === OpType.Add &&
        !patch.cancelled &&
        !isPathAnArray(patch.path),
    )
    .map((patch: IPatch) => ({
      ...patch,
      keyName: patch.path.split("/").filter(Boolean).pop() || "",
    }));

  return (
    <div className="json-wrapper">
      <span className="enclosing-bracket">{"{"}</span>
      <div className="bracket-container">
        {keys.map((key) => (
          <JsonPair
            key={key}
            basePath={path}
            level={level}
            keyName={key}
            value={json[key as keyof typeof json]}
            jsonPatch={jsonPatch}
            updateJsonData={updateJsonData}
            markPatchAsCancelled={markPatchAsCancelled}
          />
        ))}
        {keysToAdd.map((patch: IPatch) => (
          <JsonPair
            key={patch.keyName}
            basePath={path}
            level={level}
            keyName={patch?.keyName}
            value={patch.value}
            jsonPatch={jsonPatch}
            newPair={true}
            updateJsonData={updateJsonData}
            markPatchAsCancelled={markPatchAsCancelled}
          />
        ))}
      </div>
      <span className="enclosing-bracket">{"}"}</span>
    </div>
  );
};

export default JsonWrapper;
