const js = require("./javascript");
const py = require("./python");
const cpp = require("./cpp");
const java = require("./java");

function detectLanguage(code) {
  if (/def\s+\w+/.test(code)) return "python";
  if (/System\.out\.println/.test(code)) return "java";
  if (/#include\s*</.test(code) || /\bprintf\s*\(/.test(code)) return "cpp";
  if (/\bint\s+main\s*\(/.test(code)) return "cpp";
  if (/function\s+/.test(code) || /const\s+\w+\s*=/.test(code))
    return "javascript";
  return "javascript";
}

function analyze(code) {
  const lang = detectLanguage(code);

  if (lang === "python") return py(code);
  if (lang === "java") return java(code);
  if (lang === "cpp") return cpp(code);
  return js(code);
}

module.exports = analyze;
