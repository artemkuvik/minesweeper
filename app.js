let wrapper = document.createElement("div");
wrapper.classList.add("wrapper");
document.body.append(wrapper);

let grid = document.createElement("div");
grid.classList.add("grid");
wrapper.append(grid);

let restart = document.createElement("button");
restart.classList.add("restart")
restart.innerHTML = "restart";
wrapper.append(restart);

let flags = document.createElement("div");
flags.innerHTML = "Flags left: <span id='flags-left'></span>";
wrapper.append(flags);

let result = document.createElement("div");
result.id = "result";
wrapper.append(result);

let records = document.createElement("div");

let buttonColor = document.createElement("button");
buttonColor.innerHTML = "color";
buttonColor.classList.add("restart")
restart.after(buttonColor)

let color = 0;
buttonColor.onclick = function() {
  if(color === 0) {
    grid.style.backgroundColor = "#1E1112";
    grid.style.border = "10px solid #270A1F";
    for (let elem of document.querySelectorAll(".valid")) {
      elem.style.borderColor =  "#321011 #321011 #321011 #321011"
    }
    for (let elem of document.querySelectorAll(".bomb")) {
      elem.style.borderColor =  "#321011 #321011 #321011 #321011"
    }
    color = 1;
  }
  else {
    grid.style.backgroundColor = "#dcd6bc";
    grid.style.border = "10px solid #dcd6bc";
    for (let elem of document.querySelectorAll(".valid")) {
      elem.style.borderColor =  "#f5f3eb #bab7a9 #bab7a9 #fff9db"
    }
    for (let elem of document.querySelectorAll(".bomb")) {
      elem.style.borderColor =  "#f5f3eb #bab7a9 #bab7a9 #fff9db"
    }
    color = 0;
  }
 
}

let min = 0;
let hour = 0;
let sec = 0;
let timer = document.createElement("span");
let clickCounter = document.createElement("span");
grid.after(timer);
grid.after(clickCounter);
timer.innerHTML = "Time: " + '0' + hour + ':0' + min + ':0' + sec;
timer.style.padding = '5px';
timer.style.fontSize = "30px";
let counter = 0;
clickCounter.innerHTML = "; click:" + counter;

let init = setInterval(tick, 1000);

function tick() {
    sec++;
    if (sec >= 60) { 
        min++;
        sec = sec - 60;
    }
    if (min >= 60) {
        hour++;
        min = min - 60;
    }
    if (sec < 10) { 
        if (min < 10) {
            if (hour < 10) {
                timer.innerHTML ="Time: " +'0' + hour + ':0' + min + ':0' + sec;
            } else {
                timer.innerHTML ="Time: " + hour + ':0' + min + ':0' + sec;
            }
        } else {
            if (hour < 10) {
                timer.innerHTML ="Time: " +'0' + hour + ':' + min + ':0' + sec;
            } else {
                timer.innerHTML ="Time: " + hour + ':' + min + ':0' + sec;
            }
        }
    } else {
        if (min < 10) {
            if (hour < 10) {
                timer.innerHTML = "Time: " +'0' + hour + ':0' + min + ':' + sec;
            } else {
                timer.innerHTML ="Time: " + hour + ':0' + min + ':' + sec;
            }
        } else {
            if (hour < 10) {
                timer.innerHTML ="Time: " + '0' + hour + ':' + min + ':' + sec;
            } else {
                timer.innerHTML ="Time: " + hour + ':' + min + ':' + sec;
            }
        }
    }
}
grid.after(timer)

document.addEventListener('DOMContentLoaded', () => {
  const flagsLeft = document.querySelector('#flags-left')

  let width = 10
  let bombAmount = 10
  let flags = 0
  let squares = []
  let isGameOver = false
  let audio = new Audio("https://zvukogram.com/index.php?r=site/download&id=77778");
  let audio_2 = new Audio("https://zvukogram.com/index.php?r=site/download&id=85679");

  //create Board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    for(let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)
      //normal click
      square.addEventListener('click', function(e) {
        click(square)
      })

      //cntrl and left click
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }
    
    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        squares[i].setAttribute('data', total)
      }
    }
  }
  createBoard()
  restart.onclick = function() {
    squares = [];
    grid.innerHTML = "";
    isGameOver = false;
    result.innerHTML = "";
    createBoard();
     min = 0;
hour = 0;
sec = 0;
counter = 0;
clickCounter.innerHTML = "; click:" + counter;
tick()
  }
  

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        flags ++
        flagsLeft.innerHTML = bombAmount- flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
        flagsLeft.innerHTML = bombAmount- flags
      }
    }
  }

  //click on square actions
  function click(square) {
    
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      audio.play();
      square.classList.add('checked')
      let total = square.getAttribute('data')
        if (total !=0) {
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }

  document.body.onclick = function(event) {
    if (event.target.classList.contains('valid')) {
      counter++;
      clickCounter.innerHTML = "; click:" + counter;
    }
  }


  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }
  let countGame = 0;
  let table = document.createElement("div");
  document.body.append(table);
  table.style.position = "absolute";
  table.style.left = "50%";
  table.style.top = "20px";
  for(let i = countGame; i < localStorage.length; i++) {
    if(localStorage.getItem(i) !== null) {
      let tableRow = document.createElement('div');
      table.append(tableRow)
      tableRow.style.fontSize = "16px";
      tableRow.innerHTML =  localStorage.getItem(i);
      countGame++;
    }
    }
  
  function createList(number) {
    let tableRow = document.createElement('div');
    table.append(tableRow)
    tableRow.style.fontSize = "16px";
    
    tableRow.innerHTML =  localStorage.getItem(number);
    }
  
  //game over
  function gameOver(square) {
    localStorage.setItem(countGame, timer.innerHTML + clickCounter.innerHTML + " lose");
    createList(countGame)
    if(countGame > 10) {
      countGame = 0;
      localStorage.clear();
    }
    countGame++
    result.innerHTML = 'BOOM! Game Over!'
    audio_2.play()
    isGameOver = true
    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
  let matches = 0
  audio_2.play()
  localStorage.setItem(countGame, timer.innerHTML + clickCounter.innerHTML);
  createList(countGame)
  if(countGame > 10) {
    countGame = 0;
    localStorage.clear();
  }
  countGame++
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }
})



console.log(localStorage.length);




