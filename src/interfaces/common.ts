export enum OpType {
    Test = "test",
    Replace = "replace",
    Remove = "remove",
    Add = "add",
  }
  
export  interface IPatch {
    op: OpType;
    path: string;
    value?: any;
    cancelled?:boolean
    keyName?:string
  }