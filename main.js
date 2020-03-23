require('dotenv').config()
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const CURRENT_DAY = new Date().getDay();
const COLORS = [
    "White",
    "Black",
    "Yellow",
    "Purple",
    "Orange",
    "#add8e6",
    "#ff0000",
    "#F0DC82",
    "#808080"
]
const LABELS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
function makeGraph(json) {
  const fs = require("fs");

  // Create Initial Canvas
  const { CanvasRenderService } = require("chartjs-node-canvas");
  const width = 400; //px
  const height = 400; //px
  const canvasRenderService = new CanvasRenderService(
    width,
    height,
    ChartJS => {}
  );

  // Convert JSON to Array Object for Chart
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
 * @param {The function you would like to run after the JSON is written} callback 
 */
function writeJson(filename, key, value, callback) {
    let data = fs.readFileSync(filename)
    
    // Make new person if not exists
    var json = JSON.parse(data);
    if (!json[key]) json[key] = _makeNewContributor(key);

    // Set Color of Inputter
    let keyIndex = Object.keys(json).indexOf(key)
    json[key].backgroundColor = COLORS[keyIndex]

    // Set data of Inputter
    json[key].data[CURRENT_DAY] = value;

    // Write update to the JSON file
    fs.writeFile(filename, JSON.stringify(json), function(err) {
      if (err) throw err;
    });

    makeGraph(json);

    callback()
  };


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (msg.content.split(" ")[0].toLowerCase() === "!report") {
    const AUTHOR = msg.author.username;
    const VALUE = msg.content.split(" ")[1];

    // Have sending chart as callback to run sync
    writeJson("output.json", AUTHOR, VALUE, function() {
        const channel = client.channels.cache.get("691491179732140053");
        channel.send("", { files: ['./chart.png'] });
    });
    
    
  }
});
client.login(process.env.TOKEN);

