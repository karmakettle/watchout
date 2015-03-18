// width and height of svg, radius of dots
var width = 500;
var height = 400;
var radius = 7;

// score
var score = 0;
var highScore = 0;
var collisions = 0;

var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

// helper function that returns a random position
var getPos = function() {
  var x = Math.random() * (width - 10);
  var y = Math.random() * (height - 10);

  return {x: x, y: y};
};

// helper function for collision detection
var getDistance = function(player, enemy) {
  var xSquared = (player.x - enemy.x) * (player.x - enemy.x);
  var ySquared = (player.y - enemy.y) * (player.y - enemy.y);

  return Math.sqrt(xSquared + ySquared);
};

// uses getPos to create random positions for 20 enemies, overlap OK
var getEnemies = function() {
  var data = [];

  for ( var i = 0; i < 20; i++ ) {
    data.push(getPos());
  }

  return data;
};

// sets up the drag behavior that will be applied to the player
var dragMove = function() {
  var x = Number(d3.select(this).attr('cx')) + d3.event.dx;
  var y = Number(d3.select(this).attr('cy')) + d3.event.dy;

  d3.select(this).attr('cx', x).
    attr('cy', y);
};

var drag = d3.behavior.drag().
  on('drag', dragMove);

// creates a player and places them on the field
var placePlayer = function() {
  var pos = getPos();

  svg.append('circle').
    attr('class', 'player').
    attr('cx', pos.x).
    attr('cy', pos.y).
    attr('r', radius).
    attr('fill', 'orange').
    call(drag);
};

placePlayer();

// place enemies on the canvas
svg.selectAll('circle').data(getEnemies()).
  enter().append('circle').
  attr('class', 'enemy').
  attr('r', radius).
  attr('cx', function(d) { return d.x; }).
  attr('cy', function(d) { return d.y; });

// update their positions and move them
setInterval(function() {
  var data = getEnemies();

  d3.selectAll('.enemy').data(data).transition('trans_1').
    delay(0).
    duration(700).
    ease('swing').
    attr('cx', function(d) { return d.x; }).
    attr('cy', function(d) { return d.y; });
}, 2500);

// check for collisions
setInterval(function(){
  // get positions of all enemies
  var enemies = d3.selectAll('.enemy').data();

  // get position of player
  var player = d3.select('.player').data();

  for ( var i = 0; i < enemies.length; i++ ) {
    var distance = getDistance(player[0], enemies[i]);

    if ( distance <= radius * 2 ) {
      if ( score > highScore ) {
        highScore = score;
      }
      score = 0;
      collisions++;
    }

    else {
      score++;
    }

    // update display of score
    d3.select('.high span').text(highScore);
    d3.select('.current span').text(score);
    d3.select('.collisions span').text(collisions);
  }
}, 300);