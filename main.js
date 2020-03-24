require("dotenv").config();
let moment = require("moment");
require("moment-timezone");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const CURRENT_DAY = new Date().getDay();
const FORMATTED_DATE = `${new Date().getMonth() +
  1}/${new Date().getDay()}/${new Date().getFullYear()}`;
const startOfWeek = moment()
  .startOf("week")
  .format("MM/DD/YYYY");
const jsonFilename =
  moment()
    .startOf("week")
    .format("MM-DD-YYYY") + ".json";

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
];
var LABELS = [
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
  const width = 800; //px
  const height = 400; //px
  const canvasRenderService = new CanvasRenderService(
    width,
    height,
    ChartJS => {
      ChartJS.defaults.global.defaultFontColor = "white";
      console.log(ChartJS.defaults.global)
      ChartJS.plugins.register({
        beforeDraw: function(chartInstance) {

          var ctx = chartInstance.chart.ctx;
          ctx.fillStyle = "#525252";
          ctx.fillRect(
            0,
            0,
            chartInstance.chart.width,
            chartInstance.chart.height
          );
        }
      });
    }
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
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: "Month"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: "Value"
            }
          }
        ]
      },

      elements: {
        line: {
          tension: 0
        }
      },
      title: {
        display: true,
        text: "Sow Joan's Index - Week of " + startOfWeek
      },
      legend: {
        display: true,
        fontColor: "white"
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
    borderColor: "",
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
function writeJson(filename, key, value, day, callback) {
  try {
    var data = fs.readFileSync(filename);
  } catch {
    fs.writeFileSync(filename, JSON.stringify({}));
    var data = fs.readFileSync(filename);
  }
  // Make new person if not exists
  var json = JSON.parse(data);
  if (!json[key]) json[key] = _makeNewContributor(key);

  // Set Color of Inputter
  let keyIndex = Object.keys(json).indexOf(key);
  json[key].backgroundColor = COLORS[keyIndex];
  json[key].borderColor = COLORS[keyIndex];
  // Set data of Inputter
  if (day === "") {
    json[key].data[CURRENT_DAY] = value;
  } else {
    json[key].data[day] = value;
  }

  // Write update to the JSON file
  fs.writeFile(filename, JSON.stringify(json), function(err) {
    if (err) throw err;
  });

  makeGraph(json);

  callback();
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (msg.content.split(" ")[0].toLowerCase() === "!report") {
    const AUTHOR = msg.author.username;
    var VALUE = Math.round(Number(msg.content.split(" ")[1]));
    if (VALUE <= 0 || VALUE == NaN) {
      VALUE = null;
      msg.delete().then(message => {
        console.log("Deleted", message);
      });
    }
    let day = "";
    if (msg.content.split(" ").length === 3) {
      day = msg.content.split(" ")[2].toLowerCase();
      const minLabel = LABELS.map(item => item.toLowerCase());
      const minIndex = minLabel.indexOf(day);
      if (minIndex <= CURRENT_DAY) {
        day = minIndex;
      } else {
        msg.delete();
      }
    }

    // Have sending chart as callback to run sync
    writeJson(jsonFilename, AUTHOR, VALUE, day, function() {
      const channel = client.channels.cache.get("691491179732140053");

      channel.send(new Date(), { files: ["./chart.png"] });
    });

    // Delete the user message
    msg
      .delete()
      .then(message => {
        console.log("Deleted " + message);
      })
      .catch(error => {
        console.log("Unable to delte", message);
      });
  }
  if (msg.author.bot) {
    msg.channel.messages.fetch().then(messages =>
      messages
        .filter(m => m.author.bot)
        .map(messager => {
          if (messager.id != msg.id) {
            messager.delete();
          }
        })
    );
  } else {
    msg.delete();
  }
});
client.login(process.env.TOKEN);
