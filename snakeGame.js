var snakeHead,snakeBody,food,gameScore,gameStart,isGameOver;
var snakeHeadPos,keyPress,prevKeyPress,path;
var moveSnakeFun=[moveLeft,moveUp,moveRight,moveDown];
var turnSnakeFun=[TurnLeft,TurnUp,TurnRight,TurnDown];
var gameWidth = 801, gameHeight=501;
function placeFood(){
    let foodTop = parseInt((Math.random()*10000) % parseInt(gameHeight/10)) *10;
    let foodLeft = parseInt((Math.random()*10000) % parseInt(gameWidth/10)) *10;
    food.style.top = foodTop + 'px';
    food.style.left = foodLeft + 'px';
}

function createGame(){
    food = document.getElementById('food');
    gameScore = document.getElementById('game-score');
    isGameOver = document.getElementById('game-over');
    snakeHead = document.getElementById('snake-head');
    snakeBody = document.getElementById('snake-body');
    createSnake();
}

function createSnake(){
    keyPress = 37;
    prevKeyPress = 39;
    snakeHeadPos = {top: 200, left: 400};
    path = ["410px 200px","420px 200px"];
    snakeHead.style.top = snakeHeadPos.top + 'px';
    snakeHead.style.left = snakeHeadPos.left + 'px';
    snakeBody.style.boxShadow = path.join(',');
    placeFood();
    isGameOver.style.visibility = "hidden";
    gameScore.innerText = "0";
    TurnLeft();
    document.getElementById('start-game').disabled = false;
    document.getElementById('pause-game').disabled = true;
}
function addBody(){
    gameScore.innerText = +gameScore.innerText + 1;
    let prevPos1 = path[path.length-1].split(' ').map(x=>parseInt(x));
    let prevPos2 = path[path.length-2].split(' ').map(x=>parseInt(x));
    let newSnakeBody = ``;
    let direction = 'L';
    if(prevPos1[0] == prevPos2[0]){
        direction = (prevPos1[1] > prevPos2[1])? 'U' : 'D';
    }
    else if(prevPos1[1] == prevPos2[1]){
        direction = (prevPos1[0] > prevPos2[0])? 'L' : 'R';
    }
    switch(direction){
        case 'L': newSnakeBody = `${prevPos1[0]+10}px ${prevPos1[1]}px`;break;
        case 'R': newSnakeBody = `${prevPos1[0]-10}px ${prevPos1[1]}px`;break;
        case 'U': newSnakeBody = `${prevPos1[0]}px ${prevPos1[1]+10}px`;break;
        case 'D': newSnakeBody = `${prevPos1[0]}px ${prevPos1[1]-10}px`;break;
    }
    path.push(newSnakeBody);
    snakeBody.style.boxShadow += ','+newSnakeBody;
}

function snakeTurn(event){
    if(event.keyCode >=37 && event.keyCode<=40){
        let pkp = keyPress;
        keyPress = event.keyCode;
        if(pkp != keyPress)
            prevKeyPress = pkp;
        if(Math.abs(keyPress - prevKeyPress) != 2)
            turnSnakeFun[keyPress-37]();
        else
            keyPress = [39,40,37,38][keyPress-37];
    }
}
function TurnLeft(){
    snakeHead.style.transform = 'rotateZ(0deg)';
}
function TurnRight(){
    snakeHead.style.transform = 'rotateZ(180deg)';
}
function TurnUp(){
    snakeHead.style.transform = 'rotateZ(90deg)';
}
function TurnDown(){
    snakeHead.style.transform = 'rotateZ(270deg)';
}

function startGame(){
    document.getElementById('start-game').disabled = true;
    document.getElementById('pause-game').disabled = false;
    snakeHead.classList.add('snake-animation');
    gameStart = setInterval(()=>{
        if(snakeHead.offsetTop<0 || snakeHead.offsetLeft<0 
            || snakeHead.offsetTop>gameHeight || snakeHead.offsetLeft>gameWidth){
            gameOver();
            pauseGame();
            return;
        }
        else if(snakeHead.offsetTop == food.offsetTop 
            && snakeHead.offsetLeft == food.offsetLeft){
                placeFood();
                addBody();
            }
        moveSnake();
        bodyBite();
    },100);
}
function pauseGame(){
    let pauseButton = document.getElementById('pause-game');
    if(pauseButton.innerText == "Pause Game"){
        clearInterval(gameStart);
        snakeHead.classList.remove('snake-animation');
        pauseButton.innerText = "Resume Game";
    }
    else{
        startGame();
        pauseButton.innerText = "Pause Game";
    }
}
function gameOver(){
    document.getElementById('game-over').style.visibility = "visible";
}
function moveSnake(){
    path.unshift(`${snakeHeadPos.left}px ${snakeHeadPos.top}px`);
    path.pop();
    moveSnakeFun[keyPress-37]();
    snakeHead.style.top = snakeHeadPos.top + 'px';
    snakeHead.style.left = snakeHeadPos.left + 'px';
    snakeBody.style.boxShadow = path.join(',');
}
function moveLeft(){
    snakeHeadPos.left -= 10;
}
function moveRight(){
    snakeHeadPos.left += 10;
}
function moveUp(){
    snakeHeadPos.top -= 10;
}
function moveDown(){
    snakeHeadPos.top += 10;
}
function bodyBite(){
    for(let i in path){
        let curPos = path[i].split(' ').map(x=>parseInt(x));
        if(snakeHeadPos.left == curPos[0] && snakeHeadPos.top == curPos[1]){
            path = path.slice(0,i);
            break;
        }
    }
    gameScore.innerText = path.length - 2;
    snakeBody.style.boxShadow = path.join(',');     
}
