const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const CURRENT_DAY = new Date().getDay();
function makeGraph(json) {
  const fs = require("fs");


  const { CanvasRenderService } = require("chartjs-node-canvas");

  const width = 400; //px
  const height = 400; //px
  const canvasRenderService = new CanvasRenderService(
    width,
    height,
    ChartJS => {}
  );
  const LABELS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var dataset = [];
  const keys = Object.keys(json);
  keys.forEach(item => {
    dataset.push(json[item]);
  });

  const configuration = {
    type: "line",
    data: {
      labels: LABELS,
      datasets: dataset
    },
    options: {
      chartArea: {
        backgroundColor: "white"
      }
    }
  };

  const image = canvasRenderService.renderToBufferSync(configuration);
  fs.writeFileSync("chart.png", image);
} 


/**
 * A helper function used to create a key value pair
 * In the JSON Object
 *
 * @param {The author of the message} author
 */
function _makeNewContributor(author) {
  return {
    label: author,
    fill: false,
    borderColor: "White",
    data: [null, null, null, null, null, null, null]
  };
}

/**
 * This method writes to the specified JSON file
 * Creating a key if it does not exist.
 *
 * @param {The name of the JSON file to write to} filename
 * @param {The name of the Author} key
 * @param {The number the author supplied} value
 */
function writeJson(filename, key, value) {
  fs.readFile(filename, function(err, data) {
    var json = JSON.parse(data);
    if (json[key]) {
      console.log("Match");
    } else {
      json[key] = _makeNewContributor(key);
    }
    json[key].data[CURRENT_DAY] = value;

    //Write update to the JSON object
    fs.writeFile(filename, JSON.stringify(json), function(err) {
      if (err) throw err;
    });
    makeGraph(json);
  });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (msg.content.split(" ")[0].toLowerCase() === "!report") {
    const AUTHOR = msg.author.username;
    const VALUE = msg.content.split(" ")[1];
    writeJson("output.json", AUTHOR, VALUE);
    const channel = client.channels.cache.get("691491179732140053");
    async function f() {
        const myPromise = new Promise((res, rej) => {
            setTimeout(() => res("./chart.png"), 1000)
        })
        let graphLocation = await myPromise
        channel.send("Testing message", { files: [graphLocation] });
    }
    f()

  }
});

client.login("NjkxNDg5ODY5ODAwOTMxNDQw.Xngz3A.bj7JlzXrl8W3MTPsavZsWbkix0I");

// REQUIRING BELOW AUTOMATICALLY CREATES CHART
