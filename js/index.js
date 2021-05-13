const canvas = document.getElementById("visualizer")
const ctx = canvas.getContext("2d")
let queue = [] // Queue for drawing
/*
Quee item contain {
    arr: Array to draw,
    colorIndexes: Array of index that has special color,
}
*/
let timeoutQueue = [] // Timeout for clear drawing
const amountItems = 16
const duration = 40
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
    timeoutQueue = []
    queue = []
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

function drawAlgorithm(algorithm) {
    clearTimeoutQueue()
    const arr = shuffle(sampleArray)
    algorithm(arr, queue)
    queue.forEach((v, i) => {
        const handle = setTimeout(() => drawBars(v), i * duration)
        timeoutQueue.push(handle)
    })
}

// Algorithm
function visualInsertionSort(arr, queue) {
  for (let i = 1; i < arr.length; i++) {
    key = arr[i];
    prev = i - 1;
    while (key < arr[prev] && prev >= 0) {
      // Switch happen
      queue.push({
          arr: [...arr],
          colorIndexes: [prev, prev + 1]
      })
      arr[prev + 1] = arr[prev];
      console.log([...arr]);
      prev -= 1;
    }
    queue.push({
        arr: [...arr],
        colorIndexes: [prev + 1]
    })
    arr[prev + 1] = key;
  }
  queue.push({
      arr: [...arr],
      colorIndexes: []
  })
}


// Drawing part
ctx.fillStyle = "green"
drawBars({arr: sampleArray, colorIndexes: []})

const insertionSortBtn = document.getElementById("insertion-sort")
insertionSortBtn.addEventListener("click", () => {
    drawAlgorithm(visualInsertionSort)
})