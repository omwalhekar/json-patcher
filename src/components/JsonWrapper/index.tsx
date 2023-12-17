import { useContext } from "react";
import { checkIfPathIsArray, getValueType } from "../../helpers/common";
import JsonPair from "../JsonPair";
import DataContext from "../../context/DataContext";

function countSlashes(path: string) {
  // Split the path string by "/"
  var slashesArray = path.split("/");

  // Count the number of elements in the array (excluding empty elements)
  // and subtract 1 to get the number of slashes
  var numberOfSlashes = slashesArray.filter(Boolean).length;
  return numberOfSlashes;
}

const JsonWrapper = (props: {
  json: any;
  path: string;
  level: number;
}) => {
  const {jsonPatch, updateJsonData, markPatchAsCancelled} = useContext(DataContext);
  const { json, level, path} = props;
  const keys = Object.keys(json);
  const keysToAdd = jsonPatch
    .filter(
      (patch: any) => {
        const isPathAnArray = checkIfPathIsArray(patch?.path);
        return countSlashes(patch.path) === level && patch.op === "add" && !patch.cancelled && !isPathAnArray
      },
    )
    .map((patch: any) => {
      const dir = patch.path.split("/");
      const keyName = dir[dir.length - 1];
      return { ...patch, keyName };
    });

 
  return (
    <div className="json-wrapper">
      <span className="enclosing-bracket">{"{"}</span>
        <div className="bracket-container">
        {keys.map((key) => {
            return (
            <JsonPair
                key={key}
                basePath={`${path}`}
                level={level}
                keyName={key}
                value={json[key as keyof typeof json]}
                jsonPatch={jsonPatch}
                updateJsonData={updateJsonData}
                markPatchAsCancelled={markPatchAsCancelled}
            />
            );
        })}
        {keysToAdd.map((patch: any) => {
            return (
            <JsonPair
                basePath={`${path}`}
                level={level}
                keyName={patch.keyName}
                value={patch.value}
                jsonPatch={jsonPatch}
                newPair={true}
                updateJsonData={updateJsonData}
                markPatchAsCancelled={markPatchAsCancelled}
            />
            );
        })}
      </div>
        <span className="enclosing-bracket">{"}"}</span>
    </div>
  );
};

export default JsonWrapper;
