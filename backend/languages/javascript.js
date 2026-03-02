function clean(value) {
  if (!value) return value;
  return value.trim().replace(/^["'`]+|["'`]+$/g, "");
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

  const fn =
    code.match(/function\s+(\w+)/) ||
    code.match(/const\s+(\w+)\s*=\s*\(?.*?\)?\s*=>/);
  if (fn) result.functionName = fn[1];

  let match;
  const loopVars = [];
  const loopVarRegex = /for\s*\(\s*let\s+(\w+)\s*=/g;
  while ((match = loopVarRegex.exec(code)) !== null) {
    loopVars.push(match[1]);
  }
  const forRegex =
    /for\s*\(\s*let\s+(\w+)\s*=\s*(\d+);\s*\1\s*<\s*(\w+|\d+)(?:\.length)?/g;
  while ((match = forRegex.exec(code)) !== null) {
    if (isNaN(match[3])) {
      result.forLoops.push({
        type: "length",
        variable: match[1],
        array: match[3],
      });
    } else {
      result.forLoops.push({
        type: "range",
        variable: match[1],
        start: +match[2],
        end: +match[3],
      });
    }
  }

  const whileRegex = /while\s*\((.*?)\)/g;
  while ((match = whileRegex.exec(code)) !== null) {
    result.whileLoops.push(clean(match[1]));
  }

  const ifRegex = /if\s*\((.*?)\)/g;
  while ((match = ifRegex.exec(code)) !== null) {
    result.conditions.push(clean(match[1]));
  }

  const returnRegex = /return\s+([^\n;}]*)/g;
  while ((match = returnRegex.exec(code)) !== null) {
    result.returns.push(clean(match[1]));
  }

  const logRegex = /console\.log\((.*?)\)/g;
  while ((match = logRegex.exec(code)) !== null) {
    result.logs.push(clean(match[1]));
  }

  const varRegex = /let\s+(\w+)\s*=\s*([^;\n]*)/g;
  while ((match = varRegex.exec(code)) !== null) {
    if (!loopVars.includes(match[1])) {
      result.variables.push({ name: match[1], value: clean(match[2]) });
    }
  }

  const accRegex = /(\w+)\s*\+=\s*([^;\n]*)/g;
  while ((match = accRegex.exec(code)) !== null) {
    result.accumulations.push({ target: match[1], value: clean(match[2]) });
  }

  return result;
}

module.exports = analyze;
