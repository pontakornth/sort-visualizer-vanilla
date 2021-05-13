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
    ctx.fillStyle = spec.color || "green"
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
    drawSatisfication()
    queue.push({
        arr: sampleArray,
        colorIndexes: [],
    })
    // Animate
    queue.forEach((v, i) => {
        const handle = setTimeout(() => drawBars(v), i * duration)
        timeoutQueue.push(handle)
    })
}

function drawSatisfication() {
    for (let i = 0; i < sampleArray.length; i++) {
        ctx.fillStyle = "yellow"
        queue.push({
            arr: sampleArray,
            colorIndexes: [...Array(i + 1).keys()],
            color: "yellow"
        })
    }
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

function visualBubbleSort(arr, queue) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[i]) {
                queue.push({
                    arr: [...arr],
                    colorIndexes: [i, j]
                })
                temp = arr[j]
                arr[j] = arr[i]
                arr[i] = temp
            }
        }
    }
    queue.push({
        arr: [...arr],
        colorIndexes: []
    })
}

function visualSelectionSort(arr, queue) {
    for (let i = 0; i < arr.length - 1; i++) {
        let min_index = i
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min_index]) {
                min_index = j
            }
        }
        queue.push({
            arr: [...arr],
            colorIndexes: [min_index, i]
        })
        temp = arr[min_index]
        arr[min_index] = arr[i]
        arr[i] =  temp
    }
    queue.push({
        arr: [...arr],
        colorIndexes: []
    })
}

// Drawing part
ctx.fillStyle = "green"
drawBars({arr: sampleArray, colorIndexes: []})

function registerButton(name, alogrithm) {
    const button = document.getElementById(name)
    button.addEventListener("click", () => drawAlgorithm(alogrithm))
}

registerButton("insertion-sort", visualInsertionSort)
registerButton("bubble-sort", visualBubbleSort)
registerButton("selection-sort", visualSelectionSort)