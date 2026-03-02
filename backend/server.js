const express = require("express");
const cors = require("cors");
const analyze = require("./languages");
const buildNarrative = require("./storyteller");
const buildStructure = require("./structure");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/transform", (req, res) => {
  const { code, style, intensity } = req.body;
  const structure = buildStructure(code);
  const analysis = analyze(code);
  analysis.structure = structure;
  const narrative = buildNarrative(analysis, style, intensity);
  res.json({ result: narrative });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
