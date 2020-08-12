var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var imgBg = document.getElementById("img-bg");
var imgPlayerFrame1 = document.getElementById("img-player-frame1");

var playerX = 550;
var playerY = 350;
var mouseX = 0;
var mouseY = 0;

var verticalDistance;
var horizontalDistance;
var playerToMouseAngle;

console.log("hello how do you do");

function logic() {
  // we want the angle to rotate the player towards the mouse... so...
  // form a right-angle triangle from player to mouse... I mean, like, in your mind...
  //  where the hypoteneus leads directly from the player to the mouse, and
  //  the opposite side from the player is vertical, and the adjacent side from the player is horizontal...
  verticalDistance = mouseY - playerY;
  horizontalDistance = mouseX - playerX;
  // to find the angle between them, you need to use SOH CAH TOA... remember?! :D
  //  we already have the stuff for TOA (tangent(opposite / adjacent))...
  playerToMouseAngle = Math.tan(verticalDistance / horizontalDistance);
  //  which is probably negative of what we want... I dunno... we'll figure it out lol
  //    shoot... it's in radians instead of degrees... feels weird, but let's roll with it...

  console.log("degrees: " + playerToMouseAngle * (180 / 3.14));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(imgBg, 0, 0);

  // rotate the player
  ctx.translate(playerX, playerY);
  ctx.rotate(playerToMouseAngle);
  ctx.drawImage(imgPlayerFrame1, -25, -20, 25, 20);
  ctx.rotate(-playerToMouseAngle);
  ctx.translate(-playerX, -playerY);
}

function newFrame() {
  logic();
  draw();
}

setInterval(newFrame, 10);

$("body").on("mousemove", function (e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});
