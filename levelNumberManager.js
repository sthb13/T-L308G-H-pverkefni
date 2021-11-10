
"use strict";

var levelNumberManager = {


levelArray : [],
levelText : [],
levelNumber : 1,
x : 0,
y : 748,
levelTextWidth : GRID_BLOCK_W*25,
//height : 44,

update: function(du) {

},

initialize: function() {
    // Initialize the Scoreboard
    //drawLevelTxt();
},

  // Draw the text on the canvas
drawLevelTxt: function() {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(13,161,255,255)";
  var ctext = "LEVEL".split("").join(String.fromCharCode(8202));
  g_ctx.fillText(ctext, this.levelTextWidth-(GRID_BLOCK_W*5), this.y);
},

  // Draw the level number
drawLevelNumber: function() {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(242,94,0,255)";
  var ctext = (""+this.leadingZeros(this.levelNumber)).split("").join(String.fromCharCode(8202));
	g_ctx.fillText(ctext, this.levelTextWidth, this.y);
},

nextLevel: function() {
  this.levelNumber++;
},


leadingZeros: function(num) {
  var size = 3;
  var s = num+"";
  while(s.length < size) s = "0" + s;
  return s;
},

render: function(ctx) {
    this.drawLevelNumber();
    this.drawLevelTxt();
},



}
