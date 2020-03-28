// Pull in environmental variables
require("dotenv").config();

// Pull in configuration information
const { prefix } = require('./config.json');


let moment = require("moment");
require("moment-timezone");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const startOfWeek = moment()
  .startOf("week")
  .format("MM/DD/YYYY");
const jsonFilename = './json/' +
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
  //Light Blue
  "#ff0000",
  //Red
  "#ff85d8",
  //Pink
  "#00d92b",
  //Bright Green
  "#0009ba",
  //Dark Blue
  "#690000",
  //Burgundy
  "#005406",
  //Forest Green
  "#9c9400",
  //Gold
  "#87430f",
  //Brown
  "#a8315d",
  //Magenta
  "#a95de3",
  //Lavender
  "#00b093",
  //Teal
  "#c9be99",
  //Tan
  "#c75d5d",
  //Light Red
  "#abffc4"
  //Mint
];
const DAYLOOKUP = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}
var LABELS = [
  "Sunday-AM",
  "Sunday-PM",
  "Monday-AM",
  "Monday-PM",
  "Tuesday-AM",
  "Tuesday-PM",
  "Wednesday-AM",
  "Wednesday-PM",
  "Thursday-AM",
  "Thursday-PM",
  "Friday-AM",
  "Friday-PM",
  "Saturday-AM",
  "Saturday-PM"
];

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function removeEmpty() {
  var json = JSON.parse(fs.readFileSync(jsonFilename));
  let keys = Object.keys(json);
  keys.forEach(user => {
    let notEmpty = false;
    for (let i = 0; i < json[user].data.length; i++) {
      if (json[user].data[i] != null) {
        notEmpty = true;
      }
    }
    if (!notEmpty) {
      delete json[user];
    }
  });
  return json;
}
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
      ChartJS.plugins.register({
        beforeDraw: function (chartInstance) {
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
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: "Bells per Turnip"
            }
          }
        ]
      },

      elements: {
        line: {
          tension: 0
        }
      },
      spanGaps: {
        display: true
      },
      title: {
        display: true,
        text: "Sow Joan's Index - Week of " + startOfWeek
      },
      legend: {
        labels: {
          // This more specific font property overrides the global property
          fontColor: "white"
        }
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
    data: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
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
function writeJson(filename, key, value, day, msg, callback) {
  const CURRENT_DAY = new Date().getDay();

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
  try {
    json[key].backgroundColor = COLORS[keyIndex];
    json[key].borderColor = COLORS[keyIndex];
  } catch {
    json[key].backgroundColor = getRandomColor();
    json[key].borderColor = getRandomColor();
  }

  var dataKey = "";

  // Set data of Inputter
  if (day === "") {
    day = DAYLOOKUP[CURRENT_DAY]
    if (msg.createdAt.getHours() >= 12) {
      day += '-PM'
    } else {
      day += '-AM'
    }
    dataKey = LABELS.indexOf(day)
    json[key].data[dataKey] = value;
  } else {
    json[key].data[day] = value;

    day = DAYLOOKUP[CURRENT_DAY]
    if (msg.createdAt.getHours() >= 12) {
      day += '-PM'
    } else {
      day += '-AM'
    }
  }
  // let SERVER_DAY_INDEX = LABELS.indexOf(day)
  let USER_DAY = DAYLOOKUP[msg.createdAt.getDay()]
  let tempDate = new Date()
  let SERVER_DAY_INDEX = DAYLOOKUP[CURRENT_DAY]
  if (tempDate.getHours() >= 12) {
    SERVER_DAY_INDEX += '-PM'
  } else {
    SERVER_DAY_INDEX += '-AM'
  }
  SERVER_DAY_INDEX = LABELS.indexOf(SERVER_DAY_INDEX)
  if (msg.createdAt.getHours() >= 12) {
    USER_DAY += '-PM'
  } else {
    USER_DAY += '-AM'
  }

  console.log(SERVER_DAY_INDEX, 'server index')
  console.log(LABELS.indexOf(USER_DAY), 'USER DAY INDEX')

  // Write update to the JSON file
  fs.writeFileSync(filename, JSON.stringify(json));
  json = removeEmpty();

  makeGraph(json);
  const keys = Object.keys(json)
  var max = {
    user: "",
    value: 0
  }
  if (LABELS.indexOf(USER_DAY) > SERVER_DAY_INDEX) {
    dataKey = LABELS.indexOf(USER_DAY)
  } else {
    dataKey = LABELS.indexOf(day)
  }
  for (let i = 0; i < keys.length; i++) {
    let maxValue = json[keys[i]].data[dataKey]
    if (max.value < maxValue) {
      max.user = keys[i];
      max.value = maxValue
    }
  }
  callback(max);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (!msg.content.startsWith(prefix) && !msg.author.bot) {
    msg.delete()
      .then(success => console.log('Deleted non command:', success.content))
      .catch(error => console.log('Unable to delete non command:', error))
    return;
  };

  // If the message being sent on the server is a command for the bot
  if (msg.author.bot) {
    // Checks channel for messages, deletes if not bots prev message
    msg.channel.messages
      .fetch()
      .then(messages =>
        messages
          .filter(m => m.author.bot)
          .map(messager => {
            if (messager.id != msg.id) {
              messager.delete()
                .then(message => console.log('Deleted the previous bots message ', message.content))
                .catch(err => console.log('Unable to delete the previous bots message ', err));
            }
          })
      )
      .catch(err => console.log(err));
    return
  }

  // Args is everything after the command. This is because of shift()
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // If number is NaN or less than 0
  if (args[0] === null && isNaN(args[0]) || args[0] <= 0 || args[0] >= 800) {
    msg
      .delete()
      .then(message => {
        console.log("Deleted the NaN:", message.content);
      })
      .catch(err => console.log(err));
    return;
  }

  // If the message being sent on the server is a command for the bot
  if (command === "report") {

    const AUTHOR = msg.author.username;
    var VALUE = Math.round(Number(args[0]));
    const CURRENT_DAY = new Date().getDay();

    let day = "";

    // User specified a time
    if (args.length === 2) {
      day = args[1].toLowerCase();
      const minLabel = LABELS.map(item => item.toLowerCase());

      // If the day does not have a dash
      if (!day.split('-')[1]) {
        if (msg.createdAt.getHours() >= 12) {
          day += '-pm'
        } else {
          day += '-am'
        }
      }

      const minTimeIndex = minLabel.indexOf(day);
      if (minTimeIndex === -1) {
        msg.delete()
          .then(message => console.log('Day does not match any in index: ', message.content))
          .catch(error => console.log('Unable to delete index mismatch: ', error))
        return
      }
      const maxTimeIndex = DAYLOOKUP[CURRENT_DAY] + '-pm'

      // Do not allow users to write to the future
      if (minTimeIndex <= minLabel.indexOf(maxTimeIndex.toLowerCase())) {
        day = minTimeIndex;
      } else {
        msg.delete()
          .then(message => console.log('You cannot write to the future: ', message.content))
          .catch(error => console.log('Unable to delete future message: ', error))
        return;
      }
    }

    // Have sending chart as callback to run sync
    writeJson(jsonFilename, AUTHOR, VALUE, day, msg, function (max) {
      // const channel = client.channels.cache.get(process.env.CHANNEL);
      let message = ""
      if (isNaN(VALUE)) {
        message += `${AUTHOR} removed a listing.`
      } else {
        message += `${AUTHOR} just posted ${VALUE}!`
      }
      if (max.value === 0) {
        message += `\nWhat? Turnips are 0 bells!`
      } else {
        message += `\n${max.user} is selling turnips for ${max.value} bells!`
      }
  

      msg.channel.send(message, { files: ["./chart.png"] });
    });
    // Delete the user message

    msg
      .delete()
      .then(message => {
        console.log("Deleted because done:" + message.content);
      })
      .catch(error => {
        console.log("Unable to delete ", error);
      });

  } else {
    msg.delete()
      .then(message => console.log('Deleted non existant command:', message.content))
      .catch(error => console.log('Unable to delete non existant command:', error))
  }


});
client.login(process.env.TOKEN);
