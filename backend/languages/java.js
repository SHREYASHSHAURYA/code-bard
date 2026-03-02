function clean(v) {
  if (!v) return v;
  return v.trim().replace(/^["']+|["']+$/g, "");
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

  const fn = code.match(
    /(public|private|protected)?\s*(static)?\s*\w+\s+(\w+)\s*\(/,
  );
  if (fn) result.functionName = fn[3];

  let match;

  const forRegex =
    /for\s*\(\s*(?:int\s+)?(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)/g;
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

  const returnRegex = /return\s+(.*?);/g;
  while ((match = returnRegex.exec(code)) !== null) {
    result.returns.push(clean(match[1]));
  }

  const logRegex = /System\.out\.println\((.*?)\)/g;
  while ((match = logRegex.exec(code)) !== null) {
    result.logs.push(clean(match[1]));
  }
  const varRegex = /\bint\s+(\w+)\s*=\s*([^;]+);/g;
  while ((match = varRegex.exec(code)) !== null) {
    result.variables.push({
      name: match[1],
      value: clean(match[2]),
    });
  }
  const accRegex = /(\w+)\s*\+=\s*(.*?);/g;
  while ((match = accRegex.exec(code)) !== null) {
    result.accumulations.push({ target: match[1], value: clean(match[2]) });
  }

  return result;
}

module.exports = analyze;
