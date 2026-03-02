import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [style, setStyle] = useState("Fantasy Epic");
  const [intensity, setIntensity] = useState("Subtle");
  const [result, setResult] = useState("");

  const handleTransform = async () => {
    if (!code.trim()) return;

    const response = await axios.post("http://localhost:5000/transform", {
      code,
      style,
      intensity,
    });

    setResult(response.data.result);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="app">
      <header>
        <h1>CODE BARD</h1>
        <p>Transform code into legend.</p>
      </header>

      <div className="controls">
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option>Fantasy Epic</option>
          <option>Shakespearean</option>
          <option>Anime Arc</option>
          <option>Dark Prophecy</option>
          <option>Children's Story</option>
          <option>Villain Monologue</option>
        </select>

        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
        >
          <option>Subtle</option>
          <option>Dramatic</option>
          <option>Completely Unhinged</option>
        </select>

        <button onClick={handleTransform}>Transform</button>
      </div>

      <div className="panels">
        <textarea
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="output">
          <div className="output-header">
            <span>Legend</span>
            <button className="copy-btn" onClick={handleCopy}>
              Copy
            </button>
          </div>

          <div className="output-body">
            {result || "Your legend will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
