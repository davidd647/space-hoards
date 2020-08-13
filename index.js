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
  // horizontalDistance = mouseX - playerX;
  // verticalDistance = mouseY - playerY;
  // console.log(verticalDistance, horizontalDistance);
  // to find the angle between them, you need to use SOH CAH TOA... remember?! :D
  //  we already have the stuff for TOA (tangent(opposite / adjacent))...
  // playerToMouseAngle = Math.tan(verticalDistance / horizontalDistance);
  //  which is probably negative of what we want... I dunno... we'll figure it out lol
  //    shoot... it's in radians instead of degrees... feels weird, but let's roll with it...
  // console.log("degrees: " + playerToMouseAngle * (180 / 3.14));
}

var flameX;
var flameY;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(imgBg, 0, 0);

  if (mouseIsDown) {
    flameX = 30 * Math.cos(playerToMouseAngle + 90 * (Math.PI / 180));
    flameY = 30 * Math.sin(playerToMouseAngle + 90 * (Math.PI / 180));

    ctx.beginPath();
    ctx.arc(playerX + flameX, playerY + flameY, 25, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  // rotate the player
  ctx.translate(playerX, playerY);
  ctx.rotate(playerToMouseAngle);
  ctx.drawImage(imgPlayerFrame1, -25, -20, 50, 40);
  // ctx.drawImage(imgPlayerFrame1, -25, -20, 25, 20);
  ctx.rotate(-playerToMouseAngle);
  ctx.translate(-playerX, -playerY);

  // debug angle text...
  // ctx.font = "30px Arial";
  // ctx.fillStyle = "#DDDDDD";
  // ctx.fillText(
  //   Math.round(playerToMouseAngle * (180 / 3.14159) * 100) / 100 + "deg",
  //   550,
  //   350
  // );

  // debug line...
  // ctx.beginPath();
  // ctx.moveTo(playerX, playerY);
  // ctx.lineTo(mouseX, mouseY);
  // ctx.strokeStyle = "red";
  // ctx.stroke();
}

function newFrame() {
  logic();
  draw();
}

setInterval(newFrame, 10);

var tempHypoteneus = 0;

$("body").on("mousemove", function (e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;

  horizontalDistance = mouseX - playerX;
  verticalDistance = mouseY - playerY;

  // calc length of hypoteneus
  tempHypoteneus = Math.sqrt(
    horizontalDistance * horizontalDistance +
      verticalDistance * verticalDistance
  );

  if (horizontalDistance >= 0 && verticalDistance >= 0) {
    // lower-right quadrant:
    if (horizontalDistance > verticalDistance) {
      playerToMouseAngle = Math.sin(verticalDistance / tempHypoteneus);
    } else {
      playerToMouseAngle =
        (90 * Math.PI) / 180 - Math.sin(horizontalDistance / tempHypoteneus);
    }
  } else if (horizontalDistance <= 0 && verticalDistance >= 0) {
    // lower-left quadrant:
    if (Math.abs(horizontalDistance) < verticalDistance) {
      playerToMouseAngle =
        (90 * Math.PI) / 180 +
        Math.sin(Math.abs(horizontalDistance) / tempHypoteneus);
    } else {
      playerToMouseAngle =
        (180 * Math.PI) / 180 -
        Math.sin(Math.abs(verticalDistance) / tempHypoteneus);
    }
  } else if (horizontalDistance <= 0 && verticalDistance <= 0) {
    // upper-left quadrant:
    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      playerToMouseAngle =
        (180 * Math.PI) / 180 +
        Math.sin(Math.abs(verticalDistance) / tempHypoteneus);
    } else {
      playerToMouseAngle =
        (270 * Math.PI) / 180 -
        Math.sin(Math.abs(horizontalDistance) / tempHypoteneus);
    }
  } else if (horizontalDistance >= 0 && verticalDistance <= 0) {
    // upper-right quadrant
    if (horizontalDistance < Math.abs(verticalDistance)) {
      playerToMouseAngle =
        (270 * Math.PI) / 180 + Math.sin(horizontalDistance / tempHypoteneus);
    } else {
      playerToMouseAngle =
        (360 * Math.PI) / 180 -
        Math.sin(Math.abs(verticalDistance) / tempHypoteneus);
    }
  }

  playerToMouseAngle += (90 * Math.PI) / 180;
});

var mouseIsDown = false;

$("body").on("mousedown", function (e) {
  mouseIsDown = true;
  // console.log("fire boosters (approach mouse location)");
});

$("body").on("mouseup", function (e) {
  mouseIsDown = false;
  // console.log("fire boosters (approach mouse location)");
});

$("body").on("keydown", function (e) {
  if (e.keyCode == 32) {
    console.log("fire missile");
  }
});
