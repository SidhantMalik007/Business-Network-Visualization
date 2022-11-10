const { json } = require("body-parser");
var express = require("express");
const bodyParser = require("body-parser");
var app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
var neo4j = require("neo4j-driver");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
  var driver = neo4j.driver(
    "neo4j+s://b0ca48ce.databases.neo4j.io",
    neo4j.auth.basic("neo4j", "yb0gXjhnIRBAoK04u9I0xxEmz5AlkLTVuXMP2SrQLtU")
  );
  var session = driver.session();
  var session1 = driver.session();
  let nodes = [];
  let relations = [];
  await session
    .run("MATCH(n)-[:has]->(m) RETURN n.name as node ,collect(m.name) as dest")
    .then((result) => {
      // console.log(result.records);
      result.records.forEach(function (record) {
        relations.push({
          source: record.get("node"),
          dest: record.get("dest"),
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  await session1
    .run("MATCH(n) RETURN n")
    .then((result) => {
      result.records.forEach(function (record) {
        // console.log({
        //   name: record._fields[0].properties.name,
        //   level: record._fields[0].properties.level.low,
        // });
        nodes.push({
          name: record._fields[0].properties.name,
          level: record._fields[0].properties.level.low,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  res.json([{ nodes }, { relations }]);
});
app.listen(2200, () => {
  console.log("SERVER IS OPEN");
});
