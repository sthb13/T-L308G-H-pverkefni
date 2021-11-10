
"use strict";

var lifeManager = {


lifeArray : [],
lifeText : [],
lifeNumber : 5,
xOffset : 4,
y : 748,
lifeWidth : GRID_BLOCK_W*16,
//height : 44,

update: function(du) {

},

initialize: function() {
    // Initialize the life
    //drawLifeTxt();
},

  // Draw the text on the canvas
drawLifeTxt: function() {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(13,161,255,255)";
  var ctext = "MEN".split("").join(String.fromCharCode(8202));
  g_ctx.fillText(ctext, this.lifeWidth-(GRID_BLOCK_W*3)+this.xOffset, this.y);
},

  // Draw the life number
drawLifeNumber: function() {
  g_ctx.font = '31px lode_runner_c64regular';
  g_ctx.fillStyle = "rgba(242,94,0,255)";
  var ctext = (""+levelNumberManager.leadingZeros(3, this.lifeNumber)).split("").join(String.fromCharCode(8202));
	g_ctx.fillText(ctext, this.lifeWidth+this.xOffset, this.y);
},

// When player dies he looses 1 life.
looseLife: function() {
  this.lifeNumber--;
},

render: function(ctx) {
    this.drawLifeNumber();
    this.drawLifeTxt();
},



}
