import isEqual  from "lodash/isEqual"

export const areEqual = (lhs:any, rhs:any) => {
    return isEqual(lhs, rhs);
}

export const applyPatch = (originalObject:any, patch?:any) =>  {

    if(!patch) return originalObject;

    const { op, path, value } = patch;
  
    // Helper function to traverse the object and update the value at the specified path
    const updateValueAtPath = (obj:any, pathSegments:any, newValue:any) => {
      let currentObj = obj;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        currentObj = currentObj[pathSegments[i]];
      }
      currentObj[pathSegments[pathSegments.length - 1]] = newValue;
    };
  
    // Helper function to delete a property at the specified path
    const deleteValueAtPath = (obj:any, pathSegments:any) => {
      let currentObj = obj;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        currentObj = currentObj[pathSegments[i]];
      }
      delete currentObj[pathSegments[pathSegments.length - 1]];
      console.log({currentObj})
    };
  
    const pathSegments = path.split('/').filter((segment:any) => segment !== '');
  
    switch (op) {
      case 'replace':
      case 'add':
        updateValueAtPath(originalObject, pathSegments, value);
        break;
  
    
        // // For simplicity, assuming that the property to be added is the last segment in the path
        // console.log({pathSegments, originalObject})
        // const newProperty = pathSegments[pathSegments.length - 1];
        // originalObject[newProperty as any] = value;
        // break;
  
      case 'delete':
        console.log("in delete case")
        deleteValueAtPath(originalObject, pathSegments);
        break;
  
      default:
        throw new Error('Invalid operation');
    }
  
    return originalObject;
  }

 export const isValidInput = (input:any) => {
   // Check if input is an array
   if (!Array.isArray(input)) {
    return "Input must be an array";
  }

  // Valid operation types
  const validOps = ["delete", "replace", "add"];

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
