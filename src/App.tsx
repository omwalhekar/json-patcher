import { useState } from "react";
import "./App.css";
import JsonWrapper from "./components/JsonWrapper";
import { applyPatch, isValidInput } from "./helpers/common";
import set from "lodash/set";
import { JsonInput, MantineProvider  } from '@mantine/core';

function App() {
  const json = {
    "external_profiles": [{
    "label": "Website",
    "uri": "http://www.diyafoundation-india.org/Site/index.html"
    }, {
    "label": "Youtube",
    "uri": "http://www.youtube.com/watch?v=DezbmReWMf0"
    }],
    };

  const jsonPatch = [
    {
        "op": "replace",
        "path": "/external_profiles/1/uri",
        "value": "https://www.facebook.com/pages/DIYA-Foundation/"
    },
    {
        "op": "replace",
        "path": "/external_profiles/1/label",
        "value": "Facebook"
    },
    {
        "op": "add",
        "path": "/external_profiles/2",
        "value": {
            "label": "Youtube",
            "uri": "http://www.youtube.com/watch?v=DezbmReWMf0"
        }
    },
    {
        "op": "add",
        "path": "/official_name",
        "value": "Diya Foundation"
    }
];
  const [jsonData, setJsonData] = useState<any>(json);
  const [patches, setPatches] = useState<any>(jsonPatch);

  const [jsonString, setJsonString] = useState(
    JSON.stringify(patches, null, 2),
  );

  const handleTextAreaChange = (event: any) => {
    setJsonString(event);
  };

  const visualizePatch = () => {
    try {
      const newJson = JSON.parse(jsonString);
      const error = isValidInput(newJson)
      if(!error){
        setPatches(newJson);
      }else{
        window.alert(error)
      }
    } catch (error) {
      console.log(error)
      window.alert("Patch structure not valid, check console for errors")
    }
  }

  const updateJsonData = (patch?: any) => {
    console.log({ patch });
    const newJsonData: any = applyPatch(jsonData, patch);
    setJsonData((prev: any) => ({ ...newJsonData }));
  };

  const markPatchAsCancelled = (patch: any) => {
    console.log("patch to cancel:", patch);
    const newPatches = patches;
    const patchIndex = patches.indexOf(patch);

    if (patchIndex !== -1) {
      // Mark the specified patch as cancelled in-place
      set(newPatches[patchIndex], "cancelled", true);
    } else {
      console.error("Patch not found in the array");
    }

    setPatches(newPatches);
  };

  return (
    <MantineProvider>

    <div className="App">
      <div className="editor">
        <JsonInput  
          className="json-editor" 
          validationError="Invalid JSON" 
          formatOnBlur 
          value={jsonString} 
          onChange={handleTextAreaChange} 
          />
      </div>
      <button className="visualize-btn" onClick={visualizePatch}>Visualize</button>
      <div className="visualizer">
        <JsonWrapper
          json={jsonData}
          jsonPatch={patches}
          path={""}
          level={1}
          updateJsonData={updateJsonData}
          markPatchAsCancelled={markPatchAsCancelled}
          />
      </div>
    </div>
          </MantineProvider>
  );
}

export default App;
