fetch("http://localhost:2200/")
  .then((res) => res.json())
  .then((data) => {
    let nod = data[0].nodes;
    let rel = [];
    console.log(data);
    for (let i = 0; i < data[1].relations.length; i++) {
      let src1 = data[1].relations[i].source;
      let t = data[1].relations[i].dest;
      for (let j = 0; j < t.length; j++) {
        rel.push({ source: src1, target: t[j] });
      }
    }
    for (let k = 0; k < nod.length; k++) {
      var node = document.createElement("LI"); // Create a <li> node
      var textnode = document.createTextNode(nod[k].name); // Create a text node
      node.appendChild(textnode); // Append the text to <li>
      document.getElementById("CompList").appendChild(node); // Append <li> to <ul> with id="myList"
    }

    let t = document.querySelectorAll("LI");
    // console.log(nod);
    // document.querySelector(".circle").addEventListener("click", clickkk(e));

    for (let k = 0; k < t.length; k++) {
      t[k].addEventListener("click", (event) => {
        let text = event.target.textContent;
        // nod = null;
        if (text === "ALL") {
          d3.select("svg").selectAll("*").remove();
          fun(nod, rel);
          document.querySelectorAll(".node").forEach((ele) => {
            ele.addEventListener("click", (event) => {
              clickkk(event, nod, rel, nod, rel);
            });
          });
        } else {
          let nodess = [];
          let relat = [];
          for (let i = 0; i < rel.length; i++) {
            if (rel[i].source === text || rel[i].target === text) {
              relat.push(rel[i]);
              nodess.push(rel[i].source);
              nodess.push(rel[i].target);
            }
          }
          let nood = [...new Set(nodess)];
          let nodes1 = [];
          for (let i = 0; i < nood.length; i++) {
            for (let j = 0; j < nod.length; j++) {
              if (nood[i] === nod[j].name)
                nodes1.push({ name: nood[i], level: nod[j].level });
            }
          }
          d3.select("svg").selectAll("*").remove();
          // console.log(nodes1);
          fun(nodes1, relat);
          document.querySelectorAll(".node").forEach((ele) => {
            ele.addEventListener("click", (event) => {
              clickkk(event, nodes1, relat, nod, rel);
            });
          });
        }
      });
    }
  });
// function loggy(t){console.log();

// }
function fun(nod, rel) {
  ("use strict");
  const nodes = [];
  const links = [];
  const MAIN_NODE_SIZE = 20;
  const DEFAULT_DISTANCE = 30;
  const MAIN_NODE_DISTANCE = 50;
  const MANY_BODY_STRENGTH = -100;
  let i = 0;
  console.log(nod);
  console.log(rel);
  const addMainNode = (node) => {
    node.size = MAIN_NODE_SIZE;
    nodes.push(node);
  };
  const connectMainNodes = (source, target) => {
    links.push({
      source,
      target,
      distance: MAIN_NODE_DISTANCE,
      color: "#000",
    });
  };

  var graph = {
    nodes: nod,
    links: rel,
  };
  const arr = [];
  for (let i = 0; i < graph.nodes.length; i++) {
    const n = {
      color: "#F4CAAF",
      id: graph.nodes[i].name,
      size: 0,
      level: graph.nodes[i].level,
    };
    addMainNode(n);
    arr.push(n);
  }
  for (let j = 0; j < graph.links.length; j++) {
    const src = arr.find((val) => {
      return val.id == graph.links[j].source;
    });
    const des = arr.find((val) => {
      return val.id == graph.links[j].target;
    });
    connectMainNodes(src, des);
  }
  const svg = d3.select("#container");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const centerX = width / 2;
  const centerY = height / 2;
  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(MANY_BODY_STRENGTH))
    .force(
      "link",
      d3.forceLink(links).distance((link) => link.distance)
    )
    .force("center", d3.forceCenter(centerX, centerY));
  const dragInteraction = d3.drag().on("drag", (event, node) => {
    // node.fx = centerX;
    // node.fy = centerY;
    simulation.alpha(1);
    simulation.restart();
  });
  const lines = svg
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", (link) => link.color || "black");
  const circles = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .classed("node", true)
    .attr("fill", (node) => node.color || "gray")
    .attr("r", (node) => node.size)
    .call(dragInteraction);

  // circles.addEventListener("click", click(event));
  const text = svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text((node) => node.id);
  simulation.on("tick", () => {
    circles.attr("cx", (node) => node.x).attr("cy", (node) => node.y);
    text.attr("x", (node) => node.x).attr("y", (node) => node.y);
    lines
      .attr("x1", (link) => link.source.x)
      .attr("y1", (link) => link.source.y)
      .attr("x2", (link) => link.target.x)
      .attr("y2", (link) => link.target.y);
  });
  // console.log(nodes);
}
// function makeList(level)
function clickkk(event, nodes1, relat, nod, rel) {
  console.log(event.target.__data__);
  let l = event.target.__data__.level;
  let m = event.target.__data__.name;
  let n = [...nodes1];
  let r = [...relat];
  let nn = [];
  if (l === 1) {
    for (let t = 0; t < nod.length; t++) {
      if (nod[t].level === 2) {
        nn.push(nod[t]);
      }
    }
    for (let t = 0; t < rel.length; t++) {
      let s = rel[t].source;
      let d = rel[t].target;
      if (s === m || t === m)
        for (let j = 0; j < nn.length; j++) {
          if (s === nn[j].name || t === nn[j].name) r.push(rel[t]);
        }
    }
    console.log(n);
    console.log(r);
    d3.select("svg").selectAll("*").remove();
    fun(n, r);
  }
}
