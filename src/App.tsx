import { useState } from "react";
import JsonWrapper from "./components/JsonWrapper";
import { applyPatch, isValidInput } from "./helpers/common";
import set from "lodash/set";
import { JsonInput, MantineProvider } from "@mantine/core";
import DataContext from "./context/DataContext";
import "./App.css";

function App() {
  const json = {
    slug: "diya-foundation",
    name: "Diya Foundation",
    registration_number: "386/98-99",
    auditor_name: "Das Kumar And Company",
    created_at: "2013-02-08T09:28:51.000Z",
    updated_at: "2020-02-25T06:11:35.814Z",
    external_profiles: [
      {
        label: "Website",
        uri: "http://www.diyafoundation-india.org/Site/index.html",
      },
      {
        label: "Youtube",
        uri: "http://www.youtube.com/watch?v=DezbmReWMf0",
      },
    ],
    tags: ["hoh18", "lfc19", "tbpp", "housie19", "gfc2020", "housie18"],
    array: [["apple", "orange"]],
  };

  const jsonPatch = [
    {
      op: "test",
      path: "/slug",
      value: "slug",
    },
    {
      op: "test",
      path: "/name",
      value: "Diya Foundation",
    },
    {
      op: "replace",
      path: "/tags/5",
      value: "spbm18",
    },
    {
      op: "replace",
      path: "/tags/4",
      value: "bengaluru10k-18",
    },
    {
      op: "replace",
      path: "/tags/3",
      value: "lfc18-wow2",
    },
    {
      op: "replace",
      path: "/tags/2",
      value: "tcs10k-18",
    },
    {
      op: "replace",
      path: "/tags/1",
      value: "lfc18-cbp",
    },
    {
      op: "test",
      path: "/tags/0",
      value: "hoh18",
    },
    {
      op: "add",
      path: "/tags/6",
      value: "housie18",
    },
    {
      op: "add",
      path: "/tags/7",
      value: "hoh18",
    },
    {
      op: "add",
      path: "/tags/8",
      value: "lfc19",
    },
    {
      op: "add",
      path: "/tags/9",
      value: "tbpp",
    },
    {
      op: "add",
      path: "/tags/10",
      value: "housie19",
    },
    {
      op: "add",
      path: "/tags/11",
      value: "gfc2020",
    },
    {
      op: "replace",
      path: "/external_profiles/1/uri",
      value: "https://www.facebook.com/pages/DIYA-Foundation/",
    },
    {
      op: "replace",
      path: "/external_profiles/1/label",
      value: "Facebook",
    },
    {
      op: "add",
      path: "/external_profiles/2",
      value: {
        label: "Twitter",
        uri: "http://www.twitter.com/DezbmReWMf0",
      },
    },
    {
      op: "add",
      path: "/official_name",
      value: "Diya Foundation",
    },
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
      const error = isValidInput(newJson);
      if (!error) {
        setPatches(newJson);
      } else {
        window.alert(error);
      }
    } catch (error) {
      console.log(error);
      window.alert("Patch structure not valid, check console for errors");
    }
  };

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
    <DataContext.Provider
      value={{
        jsonPatch: patches,
        updateJsonData,
        markPatchAsCancelled,
      }}
    >
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
          <button className="visualize-btn" onClick={visualizePatch}>
            Visualize
          </button>
          <div className="visualizer">
            <JsonWrapper json={jsonData} path={""} level={1} />
          </div>
        </div>
      </MantineProvider>
    </DataContext.Provider>
  );
}

export default App;
