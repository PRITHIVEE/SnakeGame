var snakeHead,snakeBody,food,gift,gameScore,gameStart,isGameOver,powerupTimer;
var snakeHeadPos,keyPress,prevKeyPress,path,localGameScore,life,heart,gameSpeed;
var moveSnakeFun=[moveLeft,moveUp,moveRight,moveDown];
var turnSnakeFun=[TurnLeft,TurnUp,TurnRight,TurnDown];
var giftFunctions = [addExtraLife,slowSpeed,surviveSelfBite];
var hasLife,lifeId,giftLine;
var gameWidth = 801, gameHeight=501;
var totalScore, loaderWidth, loaderTimer;

function fixTopLeft(){
    let Top = parseInt((Math.random()*10000) % parseInt(gameHeight/10)) *10;
    let Left = parseInt((Math.random()*10000) % parseInt(gameWidth/10)) *10;
    if(Top < 30) Top += 30;
    return [Top, Left];
}

function placeFood(){
    [foodTop, foodLeft] = fixTopLeft();
    food.style.top = foodTop + 'px';
    food.style.left = foodLeft + 'px';
}

function placeGift(){
    gift.hidden = false;
    [giftTop, giftLeft] = fixTopLeft();
    gift.style.top = giftTop + 'px';
    gift.style.left = giftLeft + 'px';
}

function hideGift(){
    gift.style.left = "0";
    gift.style.top = "0";
    gift.hidden = true;
}
function resetData(){
    totalScore = 0;
    localGameScore = 0;
    gameScore.innerText = '0';
    gameSpeed = 100;
    document.getElementById('start-game').disabled = false;
    document.getElementById('pause-game').disabled = true;
    life.innerHTML = `  <li><div class="heart"></div></li>
                        <li><div class="heart"></div></li>
                        <li><div class="heart"></div></li>`;
}
function createGame(){
    food = document.getElementById('food');
    gift = document.getElementById('gift');
    gameScore = document.getElementById('game-score');
    isGameOver = document.getElementById('game-over');
    snakeHead = document.getElementById('snake-head');
    snakeBody = document.getElementById('snake-body');
    powerupTimer = document.getElementById('powerup-timer');
    life = document.getElementById('life');
    heart = document.getElementsByClassName('heart');
    giftLine = document.getElementsByClassName('gift-line');
    resetData();
    createSnake();
}

function createSnake(){
    keyPress = 37;
    prevKeyPress = 39;
    snakeHeadPos = {top: 200, left: 400};
    hasLife = [false, false, false];
    path = ["410px 200px","420px 200px"];
    snakeHead.style.top = snakeHeadPos.top + 'px';
    snakeHead.style.left = snakeHeadPos.left + 'px';
    snakeBody.style.boxShadow = path.join(',');
    placeFood();
    isGameOver.style.visibility = "hidden";
    TurnLeft();
    powerupTimer.hidden = true;
    hideGift();
    totalScore += localGameScore;
}
function addBody(){
    gameScore.innerText = ++localGameScore;
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

    if(!(localGameScore%3)){
        placeGift();
        setTimeout(hideGift,8000);
    }
    gameSpeed -= 5;
    clearInterval(gameStart);
    gameStart = setInterval(startGameController,gameSpeed);   
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

function loaderController(){
    powerupTimer.firstElementChild.style.width = loaderWidth + '%';
        loaderWidth -= 1;
        if(loaderWidth < 0){
            clearInterval(loaderTimer);
            endLoader();
        }
}
function endLoader(){
    powerupTimer.hidden = true;
    hasLife[lifeId] = false;
    clearInterval(gameStart);
    gameStart = setInterval(startGameController,gameSpeed);   
}

function startPowerTimer(){
    powerupTimer.hidden = false;
    loaderWidth = 100;
    loaderTimer = setInterval(loaderController,200);
}
function checkGameOver(){
    if(heart.length == 1){
        heart[0].parentElement.remove();
        gameOver();
        pauseGame();
    }
    else{
        heart[heart.length-1].parentElement.remove();
        createSnake();
    }
}
function startGameController(){
    if(snakeHead.offsetTop<0 || snakeHead.offsetLeft<0 
        || snakeHead.offsetTop>gameHeight || snakeHead.offsetLeft>gameWidth){
        checkGameOver();
    }
    else if(snakeHead.offsetTop == food.offsetTop 
        && snakeHead.offsetLeft == food.offsetLeft){
            placeFood();
            addBody();
        }
    else if(snakeHead.offsetTop == gift.offsetTop 
        && snakeHead.offsetLeft == gift.offsetLeft){
            lifeId = parseInt(Math.random()*100)%3;
            hasLife[lifeId] = true;
            hideGift();
            showGiftContent();
            startPowerTimer();
        }
    moveSnake();
    bodyBite();
    gameScore.innerText = localGameScore;
}

function startGame(){
    document.getElementById('start-game').disabled = true;
    document.getElementById('pause-game').disabled = false;
    snakeHead.classList.add('snake-animation');
    gameStart = setInterval(startGameController,gameSpeed);
}
function pauseGame(){
    let pauseButton = document.getElementById('pause-game');
    if(pauseButton.innerText == "Pause Game"){
        clearInterval(gameStart);
        clearInterval(loaderTimer);
        snakeHead.classList.remove('snake-animation');
        pauseButton.innerText = "Resume Game";
    }
    else{
        startGame();
        loaderTimer = setInterval(loaderController,200);
        pauseButton.innerText = "Pause Game";
    }
}
function gameOver(){
    document.getElementById('game-over').style.visibility = "visible";
    document.getElementById('ts').innerText = totalScore;
    resetData();
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
            if(!hasLife[2]){
                checkGameOver();
                return;
            }
            path = path.slice(0,i);
            break;
        }
    }
    localGameScore = (path.length - 2)>0 ? path.length - 2 : 0;
    gameScore.innerText = localGameScore;
    snakeBody.style.boxShadow = path.join(',');
}
function showGiftContent(){
    giftFunctions[lifeId]();
    giftLine[0].classList.add('line-animation');
    giftLine[1].classList.add('line-animation');
    setTimeout(()=>{
        giftLine[0].classList.remove('line-animation');
        giftLine[1].classList.remove('line-animation');
        giftLine[0].innerText = "";
        giftLine[1].innerText = "";    
    },2000);
}
function addExtraLife(){
    giftLine[0].innerText = "Extra";
    giftLine[1].innerText = "Life";
    life.innerHTML += `<li><div class='heart'></div></li>`;
}
function slowSpeed(){
    giftLine[0].innerText = "Slow";
    giftLine[1].innerText = "Speed";
    clearInterval(gameStart);
    gameStart = setInterval(startGameController,120);   
}
function surviveSelfBite(){
    giftLine[0].innerText = "Survive";
    giftLine[1].innerText = "SelfBite";
}