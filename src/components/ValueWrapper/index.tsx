import ArrayWrapper from "../ArrayWrapper";
import JsonWrapper from "../JsonWrapper";

const ValueWrapper = (props: {
  valueType: string;
  value: any;
  path: string;
  level: number;
}) => {
  const { valueType, value, path, level } = props;

  return valueType === "Object" ? (
    <JsonWrapper json={value} path={path} level={level + 1} />
  ) : valueType === "Array" ? (
    <ArrayWrapper array={value} path={path} level={level + 1} />
  ) : (
    <>"{value}"</>
  );
};

export default ValueWrapper;
