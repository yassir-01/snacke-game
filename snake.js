const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 20;

let snake;
let dx;
let dy;
let food;
let score;

let game;
let running=false;

document.addEventListener("keydown",changeDirection);

function startGame(){

if(running) return;

snake=[
{x:200,y:200},
{x:180,y:200},
{x:160,y:200}
];

dx=size;
dy=0;

score=0;

document.getElementById("score").innerText=score;

food=randomFood();

let speed=document.getElementById("level").value;

game=setInterval(drawGame,speed);

running=true;

}

function restartGame(){

clearInterval(game);

running=false;

startGame();

}

function randomFood(){

return{

x:Math.floor(Math.random()*20)*size,
y:Math.floor(Math.random()*20)*size

};

}

function changeDirection(e){

if(e.key=="ArrowUp" && dy==0){
dx=0; dy=-size;
}

if(e.key=="ArrowDown" && dy==0){
dx=0; dy=size;
}

if(e.key=="ArrowLeft" && dx==0){
dx=-size; dy=0;
}

if(e.key=="ArrowRight" && dx==0){
dx=size; dy=0;
}

}

function drawSnake(){

snake.forEach((part,index)=>{

ctx.beginPath();

ctx.fillStyle=index==0?"#00ff99":"#00cc66";

ctx.arc(part.x+10,part.y+10,10,0,Math.PI*2);

ctx.fill();

if(index==0){

drawEyes(part);

}

});

}

function drawEyes(head){

ctx.fillStyle="white";

ctx.beginPath();
ctx.arc(head.x+6,head.y+6,2,0,Math.PI*2);
ctx.fill();

ctx.beginPath();
ctx.arc(head.x+14,head.y+6,2,0,Math.PI*2);
ctx.fill();

}

function drawFood(){

ctx.fillStyle="red";

ctx.beginPath();

ctx.arc(food.x+10,food.y+10,8,0,Math.PI*2);

ctx.fill();

}

function moveSnake(){

let head={

x:snake[0].x+dx,
y:snake[0].y+dy

};

if(

head.x<0 ||
head.y<0 ||
head.x>=canvas.width ||
head.y>=canvas.height ||
snake.some(p=>p.x==head.x && p.y==head.y)

){

gameOver();
return;

}

snake.unshift(head);

if(head.x==food.x && head.y==food.y){

score++;

document.getElementById("score").innerText=score;

food=randomFood();

}else{

snake.pop();

}

}

function gameOver(){

clearInterval(game);

running=false;

ctx.fillStyle="white";

ctx.font="40px Arial";

ctx.fillText("GAME OVER",90,200);

}

function drawGame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

moveSnake();

drawSnake();

drawFood();

function setDirection(dir){
  if(dir=="up" && dy==0){ dx=0; dy=-size; }
  if(dir=="down" && dy==0){ dx=0; dy=size; }
  if(dir=="left" && dx==0){ dx=-size; dy=0; }
  if(dir=="right" && dx==0){ dx=size; dy=0; }
}

}