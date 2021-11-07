
"use strict";

var scoreManager = {


scoreArray : [],
scoreText : [],
score : 0,
x : 0,
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
  g_ctx.fillText(ctext, this.x, this.y);
},

  // Draw the score number
drawScoreNumber: function(addScore) {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(242,94,0,255)";
  this.score+=addScore;
  var ctext = (""+this.leadingZeros(this.score)).split("").join(String.fromCharCode(8202));
	g_ctx.fillText(ctext, this.scoreWidth, this.y);
},


leadingZeros: function(num) {
  var size = 7;
  var s = num+"";
  while(s.length < size) s = "0" + s;
  return s;
},

render: function(ctx) {
    this.drawScoreNumber(0);
    this.drawScoreTxt();
},



}
