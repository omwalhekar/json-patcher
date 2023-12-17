const TestTag = (props: { result: boolean }) => {
    const { result } = props;
    return result ? (
      <div className="test-passed">
        <span>Passed</span>
      </div>
    ) : (
      <div className="test-failed">
        <span>Failed</span>
      </div>
    );
  };
  
  export default TestTag;
  