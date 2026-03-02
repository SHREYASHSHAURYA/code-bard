function clean(v) {
  if (!v) return v;
  return v.trim().replace(/^["'`]+|["'`]+$/g, "");
}

function analyze(code) {
  const result = {
    functionName: null,
    forLoops: [],
    whileLoops: [],
    conditions: [],
    returns: [],
    logs: [],
    variables: [],
    accumulations: [],
  };

  let match;

  const fnRegex = /\b(int|void|float|double|char)\s+(\w+)\s*\(/;
  const fn = code.match(fnRegex);
  if (fn) result.functionName = fn[2];

  const loopVarRegex = /for\s*\(\s*(?:int\s+)?(\w+)\s*=\s*(\d+)/g;
  const loopVars = [];
  while ((match = loopVarRegex.exec(code)) !== null) {
    loopVars.push(match[1]);
  }

  const varRegex = /\b(int|float|double|char)\s+(\w+)\s*=\s*([^;]+);/g;
  while ((match = varRegex.exec(code)) !== null) {
    if (!loopVars.includes(match[2])) {
      result.variables.push({
        name: match[2],
        value: clean(match[3]),
      });
    }
  }

  const forRegex =
    /for\s*\(\s*(?:int\s+)?(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;/g;
  while ((match = forRegex.exec(code)) !== null) {
    result.forLoops.push({
      type: "range",
      variable: match[1],
      start: parseInt(match[2]),
      end: parseInt(match[3]),
    });
  }

  const whileRegex = /while\s*\((.*?)\)/g;
  while ((match = whileRegex.exec(code)) !== null) {
    result.whileLoops.push(clean(match[1]));
  }

  const ifRegex = /if\s*\((.*?)\)/g;
  while ((match = ifRegex.exec(code)) !== null) {
    result.conditions.push(clean(match[1]));
  }

  const returnRegex = /return\s+([^;]+);/g;
  while ((match = returnRegex.exec(code)) !== null) {
    result.returns.push(clean(match[1]));
  }

  const coutRegex = /std::cout\s*<<\s*([^;]+);/g;
  while ((match = coutRegex.exec(code)) !== null) {
    result.logs.push(clean(match[1]));
  }

  const accRegex = /(\w+)\s*\+=\s*([^;]+);/g;
  while ((match = accRegex.exec(code)) !== null) {
    result.accumulations.push({
      target: match[1],
      value: clean(match[2]),
    });
  }

  return result;
}

module.exports = analyze;
