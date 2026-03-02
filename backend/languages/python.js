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

  const fn = code.match(/def\s+(\w+)/);
  if (fn) result.functionName = fn[1];

  let match;

  const forRange = /for\s+(\w+)\s+in\s+range\((\d+),?\s*(\d+)?\)/g;
  while ((match = forRange.exec(code)) !== null) {
    result.forLoops.push({
      type: "range",
      variable: match[1],
      start: +match[2],
      end: match[3] ? +match[3] : null,
    });
  }

  const forIn = /for\s+(\w+)\s+in\s+(\w+)/g;
  while ((match = forIn.exec(code)) !== null) {
    result.forLoops.push({
      type: "length",
      variable: match[1],
      array: match[2],
    });
  }

  const whileRegex = /while\s+(.*?):/g;
  while ((match = whileRegex.exec(code)) !== null) {
    result.whileLoops.push(clean(match[1]));
  }

  const ifRegex = /if\s+(.*?):/g;
  while ((match = ifRegex.exec(code)) !== null) {
    result.conditions.push(clean(match[1]));
  }

  const returnRegex = /return\s+(.*)/g;
  while ((match = returnRegex.exec(code)) !== null) {
    result.returns.push(clean(match[1]));
  }

  const printRegex = /print\((.*?)\)/g;
  while ((match = printRegex.exec(code)) !== null) {
    result.logs.push(clean(match[1]));
  }

  const varRegex = /^\s*(\w+)\s*=\s*([^=\n]+)$/gm;
  while ((match = varRegex.exec(code)) !== null) {
    result.variables.push({ name: match[1], value: clean(match[2]) });
  }

  const accRegex = /(\w+)\s*\+=\s*(.*)/g;
  while ((match = accRegex.exec(code)) !== null) {
    result.accumulations.push({ target: match[1], value: clean(match[2]) });
  }

  return result;
}

module.exports = analyze;
