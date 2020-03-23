
const inputJSON = require('./output.json');
const fs = require('fs');
const { CanvasRenderService } = require('chartjs-node-canvas');

const width = 400; //px
const height = 400; //px
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => { });
const LABELS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]
var dataset = []
const keys = Object.keys(inputJSON)
keys.forEach(item => {
    dataset.push(inputJSON[item])
})
console.log(dataset)


const configuration = {
    type: 'line',
    data: {
        labels: LABELS,
        datasets: dataset,
    },
    options: {
        chartArea: {
            backgroundColor: 'white'
        }
    }
}

const image = canvasRenderService.renderToBufferSync(configuration)
fs.writeFileSync('chart.png', image)

