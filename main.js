// Pull in environmental variables
require("dotenv").config();



require("moment-timezone");

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

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
function getLastSunday(d) {
    var t = new Date(d);
    let output = "";
    t.setDate(t.getDate() - t.getDay() - 7);
    var dd = t.getDate();
    var mm = t.getMonth() + 1;
    var yyyy = t.getFullYear();
    if (dd < 10) {
        dd = "0" + dd;
    }

    if (mm < 10) {
        mm = "0" + mm;
    }
    output += `${mm}-${dd}-${yyyy}`;
    return output;
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function removeEmpty(filename) {
    var json = JSON.parse(fs.readFileSync(filename));
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

function makeGraph(json, localization) {
    var moment = require("moment");
    const fs = require("fs");
    const startOfWeek = moment()
        .startOf("week")
        .format(localization.dateFormat);

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
            labels: localization.LABELS,
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
                            labelString: localization.xScaleLabel
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
                            labelString: localization.yScaleLabel
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
                text: localization.graphTitle + startOfWeek
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
            null
        ]
    };
}

function _makeNewChannel(channelId) {
    return {
        language: 'en',
        prefix: '!',
        timezone: 'America/New_York'
    }
}

function _help(isAdmin, localization, channelPrefix) {
    var message = "";
    const possibleLanguages = fs.readdirSync('./localization/').map(filename => filename.split('.')[0])
    if (isAdmin) {
        message += localization.adminHelp(channelPrefix, possibleLanguages)
    } 
    message += localization.basicHelp(channelPrefix)

    return message
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
function writeJson(filename, key, value, day, msg, localization,channelTimezone, callback) {
    var moment = require("moment");
    var convertedDate = new Date(moment.utc(new Date(msg.createdAt)).tz(channelTimezone).format())

    const CURRENT_DAY = convertedDate.getDay();
    filename = filename + `-${msg.channel.id}.json`;

    try {
        var data = fs.readFileSync(filename);
    } catch {
        fs.writeFileSync(filename, JSON.stringify({}));
        var data = fs.readFileSync(filename);
    }
    // Make new person if not exists
    var json = JSON.parse(data);
    key = msg.author.id;
    var AUTHOR = "";
    if (msg.member.nickname) {
        AUTHOR = msg.member.nickname;
    } else {
        AUTHOR = msg.author.username;
    }
    if (!json[key]) json[key] = _makeNewContributor(AUTHOR);

    if (json[key].label != AUTHOR) {
        json[key].label = AUTHOR;
    }

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
        day = localization.DAYLOOKUP[CURRENT_DAY];
        convertedDate = new Date(moment.utc(new Date(msg.createdAt)).tz(channelTimezone).format())
        console.log(convertedDate.getHours())
        if (convertedDate.getHours() >= 12) {
            day += "-PM";
        } else {
            day += "-AM";
        }
        if (day.includes(localization.LABELS[0])) {
            day = day.split("-")[0];
        }
        dataKey = localization.LABELS.indexOf(day);
        json[key].data[dataKey] = value;
    } else {
        json[key].data[day] = value;
        day = localization.DAYLOOKUP[CURRENT_DAY];

        if (convertedDate.getHours() >= 12) {
            day += "-PM";
        } else {
            day += "-AM";
        }
        if (day.includes(localization.LABELS[0])) {
            day = day.split("-")[0];
        }
    }
    // let SERVER_DAY_INDEX = LABELS.indexOf(day)
    let USER_DAY = localization.DAYLOOKUP[convertedDate.getDay()];
    let tempDate = convertedDate;

    let SERVER_DAY_INDEX = localization.DAYLOOKUP[CURRENT_DAY];
    if (tempDate.getHours() >= 12) {
        SERVER_DAY_INDEX += "-PM";
    } else {
        SERVER_DAY_INDEX += "-AM";
    }
    if (SERVER_DAY_INDEX.includes(localization.LABELS[0])) {
        SERVER_DAY_INDEX = SERVER_DAY_INDEX.split("-")[0];
    }

    SERVER_DAY_INDEX = localization.LABELS.indexOf(SERVER_DAY_INDEX);
    if (convertedDate.getHours() >= 12) {
        USER_DAY += "-PM";
    } else {
        USER_DAY += "-AM";
    }
    if (USER_DAY.includes(localization.LABELS[0])) {
        USER_DAY = USER_DAY.split("-")[0];
    }

    // Write update to the JSON file
    fs.writeFileSync(filename, JSON.stringify(json));
    json = removeEmpty(filename);

    makeGraph(json, localization);
    const keys = Object.keys(json);
    var max = {
        user: "",
        value: 0
    };
    if (localization.LABELS.indexOf(USER_DAY) > SERVER_DAY_INDEX) {
        dataKey = localization.LABELS.indexOf(USER_DAY);
    } else {
        dataKey = localization.LABELS.indexOf(day);
    }
    var currentMax = 0;
    for (let i = 0; i < keys.length; i++) {
        json[keys[i]].data.map((element, index) => {
            if (currentMax < index && element != null) {
                currentMax = index;
            }
        });
    }
    if (CURRENT_DAY == 0) {
        let minArray = [];
        for (let i = 0; i < keys.length; i++) {
            let minValue = json[keys[i]].data[0];
            minArray.push({ author: json[keys[i]].label, value: minValue });
        }
        if (minArray.length) {
            var currentMin = minArray[0].value;
            for (let i = 0; i < minArray.length; i++) {
                if (minArray[i].value <= currentMin) {
                    currentMin = minArray[i].value;
                    max.value = minArray[i].value;
                    max.user = minArray[i].author;
                }
            }
        } else {
            max.value = 0
            max.user = null
        }

    } else {
        for (let i = 0; i < keys.length; i++) {
            let maxValue = json[keys[i]].data[currentMax];
            if (max.value < maxValue) {
                max.user = json[keys[i]].label;
                max.value = maxValue;
            }
        }
    }
    callback(max);
}
function getChannelInformation(channelId) {

    try {
        return JSON.parse(fs.readFileSync(`./configs/${channelId}.json`))
    }
    catch {
        fs.writeFileSync(`./configs/${channelId}.json`, JSON.stringify(_makeNewChannel(channelId)))
        return JSON.parse(fs.readFileSync(`./configs/${channelId}.json`))
    }
}
function deleteMessage(msg) {
    msg
        .delete()
        .then(success => { return success })
        .catch(error => { return error });
}
function printChannelInformation(channelInformation) {
    return `Language: ${channelInformation.language}\nPrefix: ${channelInformation.prefix}\nTimezone: ${channelInformation.timezone}`
}
function deleteBotMessages(msg) {

    msg.channel.messages
        .fetch()
        .then(messages =>
            messages
                .filter(m => m.author.bot)
                .map(messager => {
                    if (messager.id != msg.id) {
                        deleteMessage(messager)
                    }
                })
        )
        .catch(err => { return err });
}
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    var moment = require("moment");
    const channelId = msg.channel.id
    const channelInformation = getChannelInformation(channelId)
    
    const channelPrefix = channelInformation.prefix
    const channelLanguage = channelInformation.language
    const channelTimezone = channelInformation.timezone
    const language = require(`./localization/${channelLanguage}.js`)
    const localization = new language.Localization()
    var isAdmin = false;
    try {
        isAdmin = msg.member.hasPermission("ADMINISTRATOR")
    }
    catch {
        isAdmin = false
    }

    if (!msg.content.startsWith(channelPrefix) && !msg.author.bot) {
        deleteMessage(msg)
        return;
    }

    if (msg.author.bot) {
        deleteBotMessages(msg)
        return;
    }

    // Args is everything after the command. This is because of shift()
    const args = msg.content.slice(channelPrefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // If number is NaN or less than 0
    if ((args[0] === null && isNaN(args[0])) || args[0] <= 0 || args[0] >= 800) {
        deleteMessage(msg)
        return;
    }
    if (command === "switch") {
        if (isAdmin) {
            var switchOptions = Object.keys(channelInformation)
            var keySelected = args[0]
            if (switchOptions.includes(keySelected)) {
                // If they are choosing language
                if (args[0] == switchOptions[0]) {
                    const possibleLanguages = fs.readdirSync('./localization/').map(filename => filename.split('.')[0])
                    if (possibleLanguages.includes(args[1])) {
                        channelInformation[keySelected] = args[1]
                        fs.writeFileSync(`./configs/${channelId}.json`, JSON.stringify(channelInformation))
                        msg.author.send(printChannelInformation(channelInformation))
                    } else {
                        msg.author.send(_help(isAdmin, localization, channelPrefix))
                    }
                }
                else if (args[0] == switchOptions[1]) {
                    channelInformation[keySelected] = args[1]
                    fs.writeFileSync(`./configs/${channelId}.json`, JSON.stringify(channelInformation))
                    msg.author.send(printChannelInformation(channelInformation))
                }
                else if (args[0] == switchOptions[2]) {
                    const possibleTimezones = moment.tz.names()
                    
                    if (args[1] && possibleTimezones.includes(args[1].trim())) {
                        channelInformation[keySelected] = args[1]
                        fs.writeFileSync(`./configs/${channelId}.json`, JSON.stringify(channelInformation))
                        msg.author.send(printChannelInformation(channelInformation))
                    }
                    else {
                        msg.author.send(_help(isAdmin, localization, channelPrefix))
                    }
                }
                else {
                    msg.author.send(_help(isAdmin, localization, channelPrefix))
                }
            } else {
                msg.author.send(_help(isAdmin, localization, channelPrefix))
            }
        } else {
            msg.author.send(_help(isAdmin, localization, channelPrefix))
        }
    }
    // If the message being sent on the server is a command for the bot
    if (command === "report") {
        var AUTHOR;
        msg.member.nickname ? AUTHOR = msg.member.nickname : AUTHOR = msg.author.username
        var convertedDate = new Date(moment.utc(new Date(msg.createdAt)).tz(channelTimezone).format())

        var VALUE = Math.round(Number(args[0]));
        const CURRENT_DAY = convertedDate.getDay()
        let day = "";

        // User specified a time
        if (args.length === 2) {
            day = args[1].toLowerCase();
            const minLabel = localization.LABELS.map(item => item.toLowerCase());
            console.log(convertedDate)
            // If the day does not have a dash
            if (!day.split("-")[1]) {
                if (convertedDate.getHours() >= 12) {
                    day += "-pm";
                } else {
                    day += "-am";
                }
            }
            if (day.includes(localization.LABELS[0].toLowerCase())) {
                day = day.split("-")[0];
            }

            const minTimeIndex = minLabel.indexOf(day);
            if (minTimeIndex === -1) {
                deleteMessage(msg)
                return;
            }
            var maxTimeIndex = localization.DAYLOOKUP[CURRENT_DAY] + "-pm";

            // Handle the Sunday edge case
            if (maxTimeIndex.includes(localization.LABELS[0])) {
                maxTimeIndex = maxTimeIndex.split("-")[0];
            }

            // Do not allow users to write to the future
            if (minTimeIndex <= minLabel.indexOf(maxTimeIndex.toLowerCase())) {
                day = minTimeIndex;
            } else {
                deleteMessage(msg)
                return;
            }
        }
        console.log(`${AUTHOR} has sent a report with a value of ${VALUE} at ${new Date(msg.createdTimestamp)}`)

        var jsonFilename = `./json/${moment().startOf("week").format("MM-DD-YYYY")}`

        // Have sending chart as callback to run sync
        writeJson(jsonFilename, AUTHOR, VALUE, day, msg, localization, channelTimezone, function (max) {
            var convertedDate = new Date(moment.utc(new Date(msg.createdAt)).tz(channelTimezone).format())

            // const channel = client.channels.cache.get(process.env.CHANNEL);
            let message = "";
            if (isNaN(VALUE)) {
                message += localization.authorDelete(AUTHOR);
            } else {
                message += localization.newPost(AUTHOR, VALUE, convertedDate)
            }
            if (CURRENT_DAY == 0) {
                if (max.user === null) {
                    message += localization.noPrice()
                } else {
                    message += localization.maxPrice(max)

                }

            } else {
                if (max.value === 0) {
                    message += localization.noMax()
                } else {
                    message += localization.hasMax(max)
                }
            }

            msg.channel.send(message, { files: ["./chart.png"] });
        });
        // Delete the user message
        deleteMessage(msg)
        return;
    }

    if (command === "graph") {
        let graphArg = args.join(" ").toLowerCase()
        var jsonFilename =
            "./json/" +
            moment()
                .startOf("week")
                .format("MM-DD-YYYY");
        jsonFilename += `-${msg.channel.id}.json`
        try {
            var data = JSON.parse(fs.readFileSync(jsonFilename));
        } catch {
            fs.writeFileSync(jsonFilename, JSON.stringify({}));
            var data = JSON.parse(fs.readFileSync(jsonFilename));
        }
        // var data = JSON.parse(fs.readFileSync(jsonFilename))
        let userIdsInServer = Object.keys(data)
        let usersInServer = userIdsInServer.map(userId => data[userId].label.toLowerCase())

        // If user is in the server
        if (usersInServer.includes(graphArg)) {
            userIdsInServer.forEach(function (key) {
                if (data[key].label.toLowerCase() == graphArg) {
                    makeGraph({ key: data[key] })
                    msg.author.send("", { files: ["./chart.png"] });
                }
            })
        }
        // If user isn't in the server
        else {
            msg.author.send(localization.noUser(args, usersInServer))
        }
    }
    // Experimental history command
    else if (command === "history") {
        if (args[0].toLowerCase() === 'self') {

        }
        else if (!Boolean(args[0])) {
            var prevWeek = getLastSunday(new Date());
            try {
                var json = JSON.parse(
                    fs.readFileSync("./json/" + prevWeek + "-" + msg.channel.id + ".json")
                );
                makeGraph(json);
                msg.author.send("", { files: ["./chart.png"] });
            } catch {
                msg.author.send(localization.noPrevWeek);
            }
        } else {
            try {
                var json =
                    JSON.parse(fs.readFileSync("./json/" + args[0] + "-" + msg.channel.id + ".json"))
                makeGraph(json);
                msg.author.send("", { files: ["./chart.png"] });
            } catch {
                msg.author.send(localization.noData(args))
            }
            deleteMessage(msg)
        }

    }
    deleteMessage(msg)
    return



});

client.login(process.env.TOKEN);
