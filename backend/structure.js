function clean(v) {
  if (!v) return v;
  return v.trim().replace(/^["'`]+|["'`]+$/g, "");
}

function extractCondition(line) {
  if (line.includes("(")) {
    const match = line.match(/\((.*)\)/);
    return match ? clean(match[1]) : null;
  }

  const pyMatch = line.match(/if\s+(.*):/);
  return pyMatch ? clean(pyMatch[1]) : null;
}

function extractReturn(line) {
  const match = line.match(/return\s+([^;]+)/);
  return match ? clean(match[1]) : null;
}

function extractLog(line) {
  if (line.includes("cout")) {
    const match = line.match(/<<\s*([^;]+)/);
    return match ? { value: clean(match[1]) } : null;
  }
  const match = line.match(/\((.*)\)/);
  if (!match) return null;

  const parts = match[1].split(",").map((p) => p.trim());
  const nonString = parts.filter((p) => !/^["'`]/.test(p));

  if (nonString.length > 0) return { value: clean(nonString[0]) };
  if (parts.length > 0) return { value: clean(parts[0]) };

  return null;
}

function extractAccumulation(line) {
  const match = line.match(/(\w+)\s*\+=\s*([^;]+)/);
  if (!match) return null;
  return { target: match[1], value: clean(match[2]) };
}

function extractAssignment(line) {
  if (line.includes("==")) return null;
  const match = line.match(/(\w+)\s*=\s*([^;]+)/);
  if (!match) return null;
  return { variable: match[1], value: clean(match[2]) };
}

function buildStructure(code) {
  const lines = code.split("\n");
  const root = { type: "root", children: [] };
  const stack = [{ indent: -1, node: root }];

  lines.forEach((rawLine) => {
    if (!rawLine.trim()) return;

    const indent = rawLine.match(/^(\s*)/)[1].length;
    const line = rawLine.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    let node = null;

    if (/function\s+(\w+)/.test(line))
      node = {
        type: "function",
        meta: { name: line.match(/function\s+(\w+)/)[1] },
        children: [],
      };
    else if (/def\s+(\w+)/.test(line))
      node = {
        type: "function",
        meta: { name: line.match(/def\s+(\w+)/)[1] },
        children: [],
      };
    else if (
      /^(public\s+static\s+)?(int|void|float|double|char)\s+(\w+)\s*\(/.test(
        line,
      )
    )
      node = {
        type: "function",
        meta: {
          name: line.match(
            /^(public\s+static\s+)?(int|void|float|double|char)\s+(\w+)\s*\(/,
          )[3],
        },
        children: [],
      };
    else if (/for\s*\(|for\s+\w+\s+in/.test(line))
      node = { type: "loop", meta: {}, children: [] };
    else if (/while\s*\(|while\s+/.test(line))
      node = { type: "loop", meta: {}, children: [] };
    else if (/if\s*\(|if\s+/.test(line))
      node = {
        type: "condition",
        meta: { condition: extractCondition(line) },
        children: [],
      };
    else if (/return\s+/.test(line))
      node = { type: "return", meta: { value: extractReturn(line) } };
    else if (
      /console\.log|print\(|printf|std::cout|cout\s*<<|System\.out/.test(line)
    ) {
      const logMeta = extractLog(line);
      if (logMeta) node = { type: "log", meta: logMeta };
    } else if (/\+=/.test(line))
      node = { type: "accumulation", meta: extractAccumulation(line) };
    else if (/=\s*[^=]/.test(line))
      node = { type: "assignment", meta: extractAssignment(line) };

    if (!node) return;

    stack[stack.length - 1].node.children.push(node);

    if (node.children) {
      stack.push({ indent, node });
    }
  });

  return root;
}

module.exports = buildStructure;
