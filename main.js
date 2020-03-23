// const Discord = require('discord.js');
// const client = new Discord.Client();
const fs = require('fs');
const CURRENT_DAY = new Date().getDay()

/**
 * A helper function used to create a key value pair
 * In the JSON Object
 * 
 * @param {The author of the message} author 
 */
function _makeNewContributor(author) {
    return {
        "label": author,
        "fill": false,
        "borderColor": "White",
        "data": [null,null,null,null,null,null,null]
    }
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
    fs.readFile(filename, function (err, data) {
        var json = JSON.parse(data);
        if (json[key]) {
            console.log('Match')
        } else {
            json[key] = _makeNewContributor(key)
        }
        json[key].data[CURRENT_DAY] = value
        
        //Write update to the JSON object
        fs.writeFile(filename, JSON.stringify(json), function(err) {
            if (err) throw err;
        })
    })
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.split(' ')[0].toLowerCase() === '!report') {
      const AUTHOR = msg.author;
      const VALUE = msg.content.split(' ')[1];
      writeJson('output.json', AUTHOR, VALUE)
  }
});

// client.login('token');

// REQUIRING BELOW AUTOMATICALLY CREATES CHART
// const wonkyy = require('./chart')