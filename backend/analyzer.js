function clean(value) {
  if (!value) return value;
  return value.trim().replace(/^["'`]+|["'`]+$/g, "");
}

function extractForLoops(code) {
  const loops = [];

  const simpleRegex = /for\s*\(\s*let\s+(\w+)\s*=\s*(\d+);\s*\1\s*<\s*(\d+)/g;
  let match;
  while ((match = simpleRegex.exec(code)) !== null) {
    loops.push({
      type: "range",
      variable: match[1],
      start: parseInt(match[2]),
      end: parseInt(match[3]),
    });
  }

  const lengthRegex =
    /for\s*\(\s*let\s+(\w+)\s*=\s*(\d+);\s*\1\s*<\s*(\w+)\.length/g;
  while ((match = lengthRegex.exec(code)) !== null) {
    loops.push({
      type: "length",
      variable: match[1],
      start: parseInt(match[2]),
      array: match[3],
    });
  }

  return loops;
}

function extractWhileLoops(code) {
  const loops = [];
  const regex = /while\s*\((.*?)\)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    loops.push(clean(match[1]));
  }
  return loops;
}

function extractConditions(code) {
  const conditions = [];
  const regex = /if\s*\((.*?)\)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    conditions.push(clean(match[1]));
  }
  return conditions;
}

function extractReturns(code) {
  const returns = [];
  const regex = /return\s+([^\n;}]*)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    returns.push(clean(match[1]));
  }
  return returns;
}

function extractLogs(code) {
  const logs = [];
  const regex = /console\.log\((.*?)\)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    logs.push(clean(match[1]));
  }
  return logs;
}

function extractFunctionName(code) {
  const normal = code.match(/function\s+(\w+)/);
  if (normal) return normal[1];

  const arrow = code.match(/const\s+(\w+)\s*=\s*\(?.*?\)?\s*=>/);
  if (arrow) return arrow[1];

  return null;
}

function extractVariables(code, loopVars) {
  const vars = [];
  const regex = /let\s+(\w+)\s*=\s*([^;\n]*)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    if (!loopVars.includes(match[1])) {
      vars.push({
        name: match[1],
        value: clean(match[2]),
      });
    }
  }
  return vars;
}

function extractAccumulations(code) {
  const acc = [];
  const regex = /(\w+)\s*\+=\s*([^;\n]*)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    acc.push({
      target: match[1],
      value: clean(match[2]),
    });
  }
  return acc;
}

function analyze(code) {
  const forLoops = extractForLoops(code);
  const loopVars = forLoops.map((l) => l.variable);

  return {
    functionName: extractFunctionName(code),
    forLoops,
    whileLoops: extractWhileLoops(code),
    conditions: extractConditions(code),
    returns: extractReturns(code),
    logs: extractLogs(code),
    variables: extractVariables(code, loopVars),
    accumulations: extractAccumulations(code),
  };
}

module.exports = analyze;
