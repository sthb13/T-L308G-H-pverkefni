
"use strict";

var scoreManager = {


scoreArray : [],
scoreText : [],
score : 0,
xOffset :4,
y : 748,
scoreWidth : GRID_BLOCK_W*5,
//height : 44,

update: function(du) {

},

initialize: function() {
    // Initialize the Scoreboard
    //drawScoreTxt();
},

  // Draw the text on the canvas
drawScoreTxt: function() {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(13,161,255,255)";
  var ctext = "SCORE".split("").join(String.fromCharCode(8202));
  g_ctx.fillText(ctext, this.xOffset, this.y);
},

  // Draw the score number
drawScoreNumber: function() {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(242,94,0,255)";
  var ctext = (""+levelNumberManager.leadingZeros(7, this.score)).split("").join(String.fromCharCode(8202));
	g_ctx.fillText(ctext, this.scoreWidth+this.xOffset, this.y);
},

// When player gets gold or wins a level add relevent points to score.
addPoints: function(addToScore) {
  this.score+=addToScore;
},

// 75 points for collecting gold.
goldPoints: function() {
  this.addPoints(75);
},

// 1500 points for winning a level.
levelPoints: function() {
  this.addPoints(1500);
},

render: function(ctx) {
    this.drawScoreNumber();
    this.drawScoreTxt();
},



}
