import isEqual  from "lodash/isEqual"

export const areEqual = (lhs:any, rhs:any) => {
    return isEqual(lhs, rhs);
}

export const applyPatch = (originalObject:any, patch?:any) =>  {
  if (!patch) return originalObject;

  const { op, path, value } = patch;

  // Helper function to traverse the object and update the value at the specified path
  const updateValueAtPath = (obj: any, pathSegments: any, newValue: any) => {
    let currentObj = obj;
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];
  
      if (Array.isArray(currentObj[segment]) && !Number.isNaN(Number(pathSegments[i + 1]))) {
        // If the current segment is an array and the next segment is a number, update the array element
        const index = Number(pathSegments[i + 1]);
        if (currentObj[segment][index] !== undefined) {
          // If the index exists in the array, update the element
          currentObj = currentObj[segment];
        } else {
          // If the index is not found in the array, append the value at the end
          currentObj[segment].push(newValue);
          return;
        }
      } else {
        // If the current segment is not an array, create an empty array and update the value
        if (!currentObj[segment]) {
          currentObj[segment] = [];
        }
        currentObj = currentObj[segment];
      }
    }
  
    // If the last segment is an array and the path ends with an index, update the array element
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (Array.isArray(currentObj[lastSegment]) && !Number.isNaN(Number(lastSegment))) {
      const index = Number(lastSegment);
      if (currentObj[lastSegment][index] !== undefined) {
        currentObj[lastSegment][index] = newValue;
      } else {
        // If the index is not found in the array, append the value at the end
        currentObj[lastSegment].push(newValue);
      }
    } else {
      // Otherwise, update the value at the specified path
      currentObj[lastSegment] = newValue;
    }
  };

  // Helper function to delete a property at the specified path
  const deleteValueAtPath = (obj: any, pathSegments: any) => {
    let currentObj = obj;
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];

      if (Array.isArray(currentObj[segment]) && !Number.isNaN(Number(pathSegments[i + 1]))) {
        // If the current segment is an array and the next segment is a number
        const index = Number(pathSegments[i + 1]);
        if (currentObj[segment][index] !== undefined) {
          // If the index exists in the array, remove the element
          currentObj[segment].splice(index, 1);
          return;
        } else {
          // Handle the case when the index is not found in the array
          console.warn(`Index ${index} not found in array. No deletion performed.`);
          return;
        }
      }

      currentObj = currentObj[segment];
    }
    delete currentObj[pathSegments[pathSegments.length - 1]];
  };

  const pathSegments = path.split('/').filter((segment: any) => segment !== '');

  switch (op) {
    case 'replace':
    case 'add':
      updateValueAtPath(originalObject, pathSegments, value);
      break;

    case 'delete':
      deleteValueAtPath(originalObject, pathSegments);
      break;

    default:
      throw new Error('Invalid operation');
  }

  console.log({originalObject})
  return originalObject;
  }

 export const isValidInput = (input:any) => {
   // Check if input is an array
   if (!Array.isArray(input)) {
    return "Input must be an array";
  }

  // Valid operation types
  const validOps = ["delete", "replace", "add", "test"];

  // Check each object in the array
  for (const obj of input) {
    // Check if the object has the required keys: op, path
    if (!obj.hasOwnProperty('op') || !obj.hasOwnProperty('path')) {
      return "Each object must have 'op' and 'path' properties";
    }

    // Check if op is a valid operation type
    if (!validOps.includes(obj.op)) {
      return "'op' must be one of: 'delete', 'replace', 'add'";
    }

    // Check if op is "delete" and value is not mandatory
    if (obj.op === 'delete') {
      // Allow "value" to be present, but ignore its value for "delete"
      continue;
    } else {
      // For any other operation, value is mandatory
      if (!obj.hasOwnProperty('value')) {
        return "'value' is required for operations other than 'delete'";
      }
    }

    // You can add more specific checks for the 'value' field based on your requirements

    // Example: Check if value is a string, number, array, or object
    if (
      (typeof obj.value !== 'string' && typeof obj.value !== 'number' &&
      !Array.isArray(obj.value) && typeof obj.value !== 'object')
    ) {
      return "'value' must be a string, number, array, or object";
    }
  }

  // If all checks pass, there is no error
  return "";
  }

  export const getValueType = (obj: any) => {
    if (Array.isArray(obj)) return "Array";
    if (typeof obj === "object" && obj !== null) return "Object";
    return "String";
  }

  export function applyPatchToArray(originalArray:any, patchArray:any) {
    const resultArray = [...originalArray];
  
    patchArray.forEach(({ index, value }:any) => {
      resultArray.splice(index, 0, value);
    });
  
    return resultArray;
  }

  export const checkIfPathIsArray = (path:string) => {
    const regex = /\/\d+$/;
    return regex.test(path);
  } 