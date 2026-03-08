const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.55;

let size = 20;

let snake = [
{x:200,y:200},
{x:180,y:200},
{x:160,y:200}
];

let direction = "right";

let food = randomFood();

let score = 0;
let game;

let highscore = localStorage.getItem("highscore") || 0;
document.getElementById("highscore").innerText = highscore;

function randomFood(){

return{
x:Math.floor(Math.random()*(canvas.width/size))*size,
y:Math.floor(Math.random()*(canvas.height/size))*size
}

}

function startGame(){

let speed = document.getElementById("difficulty").value;

clearInterval(game);

game = setInterval(draw, speed);

}

function restartGame(){

snake = [
{x:200,y:200},
{x:180,y:200},
{x:160,y:200}
];

direction = "right";
score = 0;

document.getElementById("score").innerText = score;

food = randomFood();

startGame();

}

function changeDirection(dir){
direction = dir;
}

function drawSnakeSegment(x,y,color){

ctx.beginPath();
ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);
ctx.fillStyle=color;
ctx.shadowBlur=10;
ctx.shadowColor="#00ff99";
ctx.fill();
ctx.shadowBlur=0;

}

function drawSnakeHead(x,y){

drawSnakeSegment(x,y,"#00ff99");

ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(x+7,y+7,3,0,Math.PI*2);
ctx.arc(x+13,y+7,3,0,Math.PI*2);
ctx.fill();

}

function drawFood(x,y){

ctx.beginPath();
ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);
ctx.fillStyle="red";
ctx.fill();

ctx.fillStyle="green";
ctx.fillRect(x+9,y+2,4,6);

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

snake.forEach((part,i)=>{

if(i==0){
drawSnakeHead(part.x,part.y);
}else{
drawSnakeSegment(part.x,part.y,"#00cc66");
}

});

drawFood(food.x,food.y);

let head={...snake[0]};

if(direction=="right") head.x+=size;
if(direction=="left") head.x-=size;
if(direction=="up") head.y-=size;
if(direction=="down") head.y+=size;

snake.unshift(head);

if(head.x==food.x && head.y==food.y){

score++;

document.getElementById("score").innerText=score;

food=randomFood();

if(score>highscore){

highscore=score;

localStorage.setItem("highscore",highscore);

document.getElementById("highscore").innerText=highscore;

}

}else{

snake.pop();

}

if(
head.x<0 ||
head.y<0 ||
head.x>=canvas.width ||
head.y>=canvas.height ||
snake.slice(1).some(p=>p.x==head.x && p.y==head.y)
){

clearInterval(game);

alert("Game Over");

}

}

document.addEventListener("keydown",function(e){

if(e.key=="ArrowUp" && direction!="down") direction="up";
if(e.key=="ArrowDown" && direction!="up") direction="down";
if(e.key=="ArrowLeft" && direction!="right") direction="left";
if(e.key=="ArrowRight" && direction!="left") direction="right";

});