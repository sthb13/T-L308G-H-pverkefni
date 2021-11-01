// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

helperGrid: function (ctx) {
	  const lw = 0.5;  // lineWidth
	  const st = '#00ff00' // strokestyle
    const stepX = 40;
    const stepY = 44;
    const w = 1120;
    const h = 704;
    ctx.beginPath();
    // horizontal grid
    for (var x=0, i=0;x<=w;x+=stepX, i++) {
  	    ctx.font='8px sans';
        ctx.fillStyle = '#00ff00';
        ctx.fillText(x,x+3,10);
        ctx.fillText(`[${i}]`,x+23,20);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
    }
    ctx.strokeStyle = st;
    ctx.lineWidth = lw;
    ctx.stroke(); 
    ctx.beginPath(); 
    // vertigal grid
    for (var y=0,i=0;y<=h;y+=stepY, i++) {
  	    ctx.font='8px sans';
        ctx.fillText(y,3,y+10);
        ctx.fillText(`[${i}]`,23,y+20);
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }
    ctx.strokeStyle = st;
    ctx.lineWidth = lw;
    ctx.stroke();
   }

};
