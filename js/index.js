const canvas = document.getElementById("visualizer")
const ctx = canvas.getContext("2d")
const queue = [] // Queue for drawing
/*
Quee item contain {
    arr: Array to draw,
    colorIndexes: Array of index that has special color,
}
*/
const timeoutQueue = [] // Timeout for clear drawing
const amountItems = 16
const sampleArray = [...Array(amountItems).keys()]

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;


}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearTimeoutQueue() {
    timeoutQueue.forEach(x => clearTimeout(x))
    clearCanvas()
}

function drawBars(spec) {
    clearCanvas();
    const rectangleWidth = canvas.width / spec.arr.length;
    for (let i = 0; i < spec.arr.length; i++) {
      const startX = rectangleWidth * i;
      const width = rectangleWidth;
      const startY = 480 - (spec.arr[i] / 16) * 480 - 16;
      const height = 480;
      ctx.strokeRect(startX, startY, width, height);
      if (spec.colorIndexes.includes(i)) {
        ctx.fillRect(startX, startY, width, height);
      }
    }
}


// Drawing part
ctx.fillStyle = "green"
drawBars({arr: sampleArray, colorIndexes: [0, 3]})