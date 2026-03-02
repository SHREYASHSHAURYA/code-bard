# Code Bard

Code Bard is a web application that transforms source code into stylized narrative formats such as Fantasy Epic, Shakespearean tragedy, Anime Arc, Dark Prophecy, Children’s Story, and Villain Monologue.

It is not an explanation engine.  
It is a creative reinterpretation engine.

---

## Overview

Input: Any code snippet (JavaScript, Python, C, C++, Java)  
Output: A narrative version of that code in a selected style.

The engine is rule-based and block-aware. It detects:

- Functions
- Loops
- Nested conditions
- Assignments
- Accumulations (+=)
- Guard clauses
- Early returns
- Basic logging/printing
- Aggregation patterns (e.g., running totals)

It does not rely on AST parsing or AI.

---

## Tech Stack

Frontend:

- React (Vite)
- Axios
- Custom CSS

Backend:

- Node.js
- Express
- Rule-based transformation engine

---

## Features

- Multi-language structural support (JS, Python, C, C++, Java)
- Block-aware narration
- Early return detection
- Smart aggregation detection
- Pronoun-aware hero narration
- Intensity modes (Subtle, Dramatic, Completely Unhinged)
- Style switching
- Copy-to-clipboard support
- Clean dual-panel UI

---

## Project Structure

```
code-bard/
│
├── frontend/ # React (Vite) UI
├── backend/ # Express API + transformation engine
└── README.md
```

---

## Installation

1. Install frontend dependencies

```bash
cd frontend
npm install
```

2. Install backend dependencies

```bash
cd ../backend
npm install
```

---

## Running the App

Start backend:

```bash
cd backend
node server.js
```

Backend runs on:

```
http://localhost:5000
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open the local URL shown in the terminal.

---

## Example

Input:

```javascript
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
```

Output (Fantasy Epic):

```
A quiet intention stirred.
Lyra invoked the ritual "calculateSum".
She set "sum" to 0.
A cycle of repetition unfolded.
She added arr[i] to "sum".
She accumulated values into "sum" and returned the final total.
Thus the legend of Lyra endured.
```

---

## Design Philosophy

Code Bard does not aim for perfect semantic interpretation.
It aims for:

- Structural awareness
- Narrative consistency
- Creative reinterpretation
- Deterministic behavior
- Multi-language compatibility

It solves boredom, not productivity.

---

## Limitations

- No AST parsing
- No deep semantic execution
- No class-level understanding
- No async/await interpretation
- No recursion analysis

Best suited for:

- Algorithmic code
- Interview-style problems
- Educational examples
- Structured functions

---

## Future Improvements

- Max-pattern detection
- Counter-pattern detection
- Guard clause summarization
- Style-specific narration differences
- AI enhancement layer
- Export as scroll-style PDF
- Theme-based UI modes
