import $ from "jquery";
// import webgazer from "webgazer";

webgazer
  .setGazeListener(function (data, elapsedTime) {
    var xprediction = data.x;
    var yprediction = data.y;
  })
  .begin();

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var imgBg = document.getElementById("img-bg");
var imgPlayerFrame1 = document.getElementById("img-player-frame1");
var imgPlayerFrame2 = document.getElementById("img-player-frame2");
var imgPlayerFrame3 = document.getElementById("img-player-frame3");
var playerAnimationItterator = 0;

var playerX = 550;
var playerY = 350;
var mouseX = 0;
var mouseY = 0;

var verticalDistance;
var horizontalDistance;
var playerToMouseAngle;

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
  enemyItterator++;

  if (enemyItterator >= 100) {
    enemies.push({
      posX: 0,
      posY: Math.random() * canvas.height,
      displaceX: Math.random() * 1.5,
      displaceY: Math.random() * 3 - 1.5,
    });
    enemyItterator = 0;
  }

  enemies.forEach((enemy) => {
    enemy.posX += enemy.displaceX;
    enemy.posY += enemy.displaceY;
  });
}

var flameX;
var flameY;
var flameSize = 10;
var flameGrow = true;

var trajectoryIncrementX = 0;
var trajectoryIncrementY = 0;
var trajectoryX = 0;
var trajectoryY = 0;

var missileIsPrepared = true;
var missiles = [];
var missileToDelete = null;

var enemyItterator = 0;
var enemies = [];

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(imgBg, 0, 0);

  playerX += trajectoryX;
  playerY += trajectoryY;

  if (mouseIsDown) {
    trajectoryIncrementX = Math.cos(playerToMouseAngle - 90 * (Math.PI / 180));
    trajectoryIncrementY = Math.sin(playerToMouseAngle - 90 * (Math.PI / 180));

    trajectoryX += trajectoryIncrementX * 0.01;
    trajectoryY += trajectoryIncrementY * 0.01;

    flameX = 30 * Math.cos(playerToMouseAngle + 90 * (Math.PI / 180));
    flameY = 30 * Math.sin(playerToMouseAngle + 90 * (Math.PI / 180));

    if (flameSize <= 10) {
      flameGrow = true;
    } else if (flameSize >= 15) {
      flameGrow = false;
    }

    if (flameGrow) {
      flameSize += Math.random() * 0.5;
    } else {
      flameSize -= Math.random() * 0.5;
    }

    ctx.beginPath();
    ctx.arc(
      playerX + flameX,
      playerY + flameY,
      flameSize,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  if (spaceIsDown) {
    if (missileIsPrepared) {
      // fire a missile...
      missiles.push({
        posX: playerX,
        posY: playerY,
        displaceX: 2 * Math.cos(playerToMouseAngle + 90 * (Math.PI / 180)),
        displaceY: 2 * Math.sin(playerToMouseAngle + 90 * (Math.PI / 180)),
      });

      missileIsPrepared = false;
    }
  } else if (!spaceIsDown) {
    missileIsPrepared = true;
  }

  missiles.forEach((missile, i) => {
    missile.posX += missile.displaceX;
    missile.posY += missile.displaceY;

    ctx.beginPath();
    ctx.arc(missile.posX, missile.posY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();

    // mark missile for splicing...
    if (missile.posX < 0 || missile.posX >= canvas.width) {
      missileToDelete = i;
    } else if (missile.posY < 0 || missile.posY >= canvas.height) {
      missileToDelete = i;
    }
  });

  if (missileToDelete != null) {
    missiles.splice(missileToDelete, 1);
    missileToDelete = null;
  }

  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.arc(enemy.posX, enemy.posY, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
  });

  // rotate the player
  ctx.translate(playerX, playerY);
  ctx.rotate(playerToMouseAngle);

  playerAnimationItterator++;
  if (spaceIsDown) {
    ctx.drawImage(imgPlayerFrame3, -25, -20, 50, 40);
  } else if (playerAnimationItterator < 50) {
    ctx.drawImage(imgPlayerFrame1, -25, -20, 50, 40);
  } else if (playerAnimationItterator < 100) {
    ctx.drawImage(imgPlayerFrame2, -25, -20, 50, 40);
  } else {
    playerAnimationItterator = 0;
  }

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

$("canvas").on("mousedown", function (e) {
  mouseIsDown = true;
  // console.log("fire boosters (approach mouse location)");
});

$("canvas").on("mouseup", function (e) {
  mouseIsDown = false;
  // console.log("fire boosters (approach mouse location)");
});

var spaceIsDown = false;

$("body").on("keydown", function (e) {
  if (e.keyCode == 32) {
    spaceIsDown = true;
  }
});

$("body").on("keyup", function (e) {
  if (e.keyCode == 32) {
    spaceIsDown = false;
  }
});

$("#missile-alt").on("mousedown", function (e) {
  spaceIsDown = true;
});

$("#missile-alt").on("mouseup", function (e) {
  spaceIsDown = false;
});
