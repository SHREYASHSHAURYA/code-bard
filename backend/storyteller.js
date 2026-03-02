const heroes = ["Aldric", "Lyra", "Kael", "Seraphine", "Draven", "Mira"];

const pronouns = {
  Aldric: "He",
  Kael: "He",
  Draven: "He",
  Lyra: "She",
  Seraphine: "She",
  Mira: "She",
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function intro(intensity) {
  if (intensity === "Completely Unhinged")
    return "The sky fractured as logic unraveled.";
  if (intensity === "Dramatic") return "Destiny stirred with restless force.";
  return "A quiet intention stirred.";
}

function subject(hero, context) {
  if (!context.heroMentioned) {
    context.heroMentioned = true;
    return hero;
  }
  return pronouns[hero];
}

function narrate(node, hero, context) {
  let text = "";
  const newContext = { ...context };

  if (node.type === "function") {
    text += `${subject(hero, newContext)} invoked the ritual "${node.meta.name}".\n`;
    newContext.functionName = node.meta.name;
  }

  if (node.type === "loop") {
    text += `A cycle of repetition unfolded.\n`;
    newContext.insideLoop = true;
  }

  if (node.type === "condition") {
    const cleanCondition = node.meta.condition
      .replace(/===/g, " equals ")
      .replace(/==/g, " equals ");

    if (newContext.insideLoop)
      text += `If ${cleanCondition} became true within the cycle, it changed the course.\n`;
    else text += `If ${cleanCondition} held true, events shifted.\n`;

    newContext.insideCondition = true;
  }

  if (node.type === "assignment" && node.meta) {
    if (node.meta.value === "0") {
      newContext.aggregations[node.meta.variable] = {
        initialized: true,
        accumulated: false,
        returned: false,
      };
    }

    text += `${subject(hero, newContext)} set "${node.meta.variable}" to ${node.meta.value}.\n`;
  }

  if (node.type === "accumulation" && node.meta) {
    if (newContext.aggregations[node.meta.target]) {
      newContext.aggregations[node.meta.target].accumulated = true;
    }

    text += `${subject(hero, newContext)} added ${node.meta.value} to "${node.meta.target}".\n`;
  }

  if (node.type === "log" && node.meta) {
    text += `The value of ${node.meta.value} was revealed.\n`;
  }

  if (node.type === "return") {
    if (
      newContext.aggregations[node.meta.value] &&
      newContext.aggregations[node.meta.value].initialized &&
      newContext.aggregations[node.meta.value].accumulated
    ) {
      return {
        text: `${subject(hero, newContext)} accumulated values into "${node.meta.value}" and returned the final total.\n`,
        ended: true,
      };
    }

    if (newContext.functionName === "main" && node.meta.value === "0")
      return { text: "", ended: false };

    if (newContext.insideCondition)
      return {
        text: `The ritual ended early with ${node.meta.value}.\n`,
        ended: true,
      };

    return {
      text: `At last, ${node.meta.value} was delivered as the outcome.\n`,
      ended: true,
    };
  }

  if (node.children) {
    for (const child of node.children) {
      const result = narrate(child, hero, newContext);

      if (typeof result === "string") {
        text += result;
      } else {
        text += result.text;
        if (result.ended) {
          return { text, ended: true };
        }
      }
    }
  }

  return { text, ended: false };
}

function buildNarrative(analysis, style, intensity) {
  const hero = random(heroes);

  const context = {
    heroMentioned: false,
    insideLoop: false,
    insideCondition: false,
    functionName: null,
    aggregations: {},
  };

  let story = intro(intensity) + "\n";

  if (analysis.structure) {
    const result = narrate(analysis.structure, hero, context);
    story += result.text;
  }

  if (style === "Fantasy Epic")
    story += `\nThus the legend of ${hero} endured.`;
  if (style === "Shakespearean") story += `\nSo concludes the tragic verse.`;
  if (style === "Anime Arc") story += `\nTo be continued...`;
  if (style === "Dark Prophecy") story += `\nDestiny sealed its decree.`;
  if (style === "Children's Story")
    story += `\n${hero} learned something important.`;
  if (style === "Villain Monologue") story += `\nIt was all by design.`;

  return story.trim();
}

module.exports = buildNarrative;
