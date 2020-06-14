module.exports = {
    Localization: function () {
        this.LABELS = [
            "Sunday", // 0
            "Monday-AM", // 1
            "Monday-PM", // 2
            "Tuesday-AM", // 3
            "Tuesday-PM", // 4
            "Wednesday-AM", // 5
            "Wednesday-PM", //6
            "Thursday-AM", //7
            "Thursday-PM", //8
            "Friday-AM", //9
            "Friday-PM", //10
            "Saturday-AM", //11
            "Saturday-PM" //12
        ]
        this.DAYLOOKUP = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        }
        this.dateFormat = "MM/DD/YYYY"
        this.xScaleLabel = "Time"
        this.yScaleLabel = "Bells per Turnip"
        this.graphTitle = "Sow Joan's Index - Week of "
        this.authorDelete = (author) => `${author} removed a listing.`
        this.newPost = (author, value, date) => `${author} just posted ${value} at ${date.toDateString()}! `;
        this.noPrice = () => `\nNo one has posted their prices for today!`
        this.maxPrice = (max) => `\nYou can get turnips for ${max.value} from ${max.user}`
        this.noMax = () => `\nWhat? Turnips are 0 bells!`;
        this.hasMax = (max) => `\n${max.user} is selling turnips for ${max.value} bells!`;
        this.noUser = (args, users) => `The user ${args.join(" ")} doesn't exist in that server. Maybe try:\n${users.join('\n')}`
        this.noPrevWeek = (prevWeek) => `We don't have data for ${prevWeek}`
        this.noData = (args) => `We don't have data for ${args[0]}`
        this.basicHelp = (channelPrefix) => {
            return `
        Some regular commands:
            ${channelPrefix}report <number> Report a price for the current time of day
            ${channelPrefix}report none Remove a price for the current time of day
            ${channelPrefix}report <number> <day>-<am|pm> Report a price for a specific time period
        To get the graph of an individual you will have to:
            ${channelPrefix}graph <username> Don't worry if you get it wrong! The bot will let you know if the options.
        Some examples!
            ${channelPrefix}report 50
            ${channelPrefix}report none
            ${channelPrefix}report 50 monday-pm
            ${channelPrefix}graph blaleb
        Don't see a command that you would like or have suggestions? Join the Discord to help drive development.`
        }
        this.adminHelp = (channelPrefix, languages) => {
            return `
                Currently supported languages: ${languages}
                ${channelPrefix}switch <language|prefix|timezone> <your language/prefix/timezone>
            For a list of accepted timezones, check https://momentjs.com/timezone/ , Example: America/New_York`
        }
    }
}