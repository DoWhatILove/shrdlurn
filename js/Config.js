"use strict"
var configs = {};
configs.URL_Parameters = util.parseQueryString();
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8400"
if (configs.URL_Parameters.hasOwnProperty("local")) {
  configs.SEMPRE_URL = "http://localhost:8400";
}
configs.debugMode = false;
if (configs.URL_Parameters.hasOwnProperty("debug")) {
  configs.debugMode = true;
}
configs.bePragmatic = true;
if (configs.URL_Parameters.hasOwnProperty("nopragmatics")) {
  configs.bePragmatic = false;
}
configs.costPerStep = 3;
configs.costPerScroll = 1;

configs.defaultMaxSteps = 3;
configs.hardMaxSteps = true; // not allowing num steps to exceed this

configs.maximumNbest = 42;


configs.levels = []
configs.levels.push({
    id: "remove",
    name: "basics",
    maxSteps: 2,
    description: "",
    minSuccess: 5
})
configs.levels.push({
    id: "babystep",
    name: "babysteps",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "pattern",
    name: "patterns",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "babynot",
    name: "notbaby",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "babystack",
    name: "stacks",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "littlehouse",
    name: "house",
    maxSteps: 4,
    description: "",
    minSuccess: 1
})
configs.levels.push({
    id: "triangle",
    name: "triangle",
    maxSteps: 4,
    description: "",
    minSuccess: 1
})

if (false) {
configs.levels.push({
    id: "bottle",
    name: "bottle",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "fork",
    name: "fork",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "ship",
    name: "ship",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "bigrandom",
    name: "playground",
    maxSteps: 4,
    description: "",
    minSuccess: 100
})
}
