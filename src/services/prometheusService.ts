import client from 'prom-client'

const collectDefaultMetrics = client.collectDefaultMetrics;

const signIns = new client.Counter({
  name: "signIns",
  help: "The number of signIns",
});

const signUps = new client.Counter({
  name: "signUps",
  help: "The number of signUps",
});

const logOuts = new client.Counter({
  name: "logOuts",
  help: "The number of logOuts",
});

collectDefaultMetrics()

export default { signIns, signUps, logOuts }
