//At Level 1 we have circle, it is Alexa skill
//At Level 2 we have rectangle, it is Intent 

//need to save states of graphs at each level
//add delete button
//identify each node

//slot type must be created before using them

var level = 1;

// get canvas related references
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var objectTodraw = "skill";
var showFullGraph = false;
var distanceThresold = 300;

//Buttons for diffrent level objects
var skillButton = document.getElementById('skill');

var intentButton = document.getElementById('intent');

var slotButton = document.getElementById('slot');

var typeButton = document.getElementById('value');

//button to show full graph
var fullGraph = document.getElementById('fullGraph');

//right view section
var rightView = document.getElementsByClassName('rightView');

// drag related variables
var dragok = false;
var startX;
var startY;

// an array of objects that define different rectangles
var rects = [];
var circles = [];
var lines = [];

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

// call to draw the scene
draw();

//add rectangle
function addRec(fill,x,y,w,h,dragingNow,level = 1,line = null,lines = []) {
	rects.push({
	    x: x,
	    y: y,
	    width: w,
	    height: h,
	    fill: fill,
	    isDragging: dragingNow,
	    hasLine: false,
	    line:line,
	    lines:lines,
	    level:level,
	    name:"Undefined"
	});	
}

//add circle
function addCircle(fill,x,y,r,sAngle,eAngle,dragingNow,level = 1,line = null,lines = []) {
	circles.push({
	    x: x,
	    y: y,
	    width:0,
	    height:0,
	    radius: r,
	    sAngle: sAngle,
	    eAngle: eAngle,
	    fill: fill,
	    isDragging: dragingNow,
	    hasLine: false,
	    line:line,
	    lines:lines,
	    level:level,
	    name:"Undefined"
	});	
}

//add circle
function addLines(cx,cy,rx,ry,level = 1) {
	lines.push({
	    cx: cx,
	    cy: cy,
	    rx: rx,
	    ry: ry,
	    level:level
	});	
}

// draw a single rect
function rect(x, y, w, h) {
	ctx.shadowBlur = 4;
	ctx.strokeStyle = "yellow";
	ctx.lineWidth   = 8;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
	ctx.stroke();
    ctx.fill();
}

//draw a circle
function circle(x,y,r,sAngle,eAngle) {

	ctx.shadowColor = "white";
	ctx.shadowBlur = 10;
	ctx.strokeStyle = "aqua";
	ctx.lineWidth   = 8;
	ctx.beginPath();
	ctx.arc(x,y,r,sAngle,eAngle);
    ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

function Lines(cx,cy,rx,ry) {
	ctx.shadowBlur = 4;
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#fff';
	ctx.moveTo(cx,cy);
	ctx.lineTo(rx,ry);
	ctx.stroke();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    ctx.fillStyle = "#000";
    rect(0, 0, WIDTH, HEIGHT);
    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
    	if(r.level-level==0 || r.level-level==1 || showFullGraph){
	        ctx.fillStyle = r.fill;
	        rect(r.x, r.y, r.width, r.height);
    	}
    }

    for (var i = 0; i < lines.length; i++) {
    	var r = lines[i];
    	if(r.level-level==0 || showFullGraph){
    		Lines(r.cx,r.cy,r.rx,r.ry);
    	}
    }
    for (var i = 0; i < circles.length; i++) {
        var r = circles[i];
        if(r.level-level==0 || r.level-level==1 || showFullGraph){
	        ctx.fillStyle = r.fill;
	        circle(r.x, r.y, r.radius, r.sAngle,r.eAngle);
    	}
    }
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height && (r.level-level==0 || r.level-level==1)) {
            // if yes, set that rects isDragging=true
            dragok = true;
            r.isDragging = true;
            break;
        }
    }

    for (var i = 0; i < circles.length; i++) {
        var r = circles[i];
        if (mx > r.x - r.radius && mx < r.x + r.radius && my > r.y - r.radius && my < r.y + r.radius && (r.level-level==0 || r.level-level==1)) {
            // if yes, set that circles isDragging=true
            dragok = true;
            r.isDragging = true;
            break;
        }
    }

    if(!dragok){
    	switch(objectTodraw){
    		case "skill":
    			if(level==1)
    				addCircle("#0c64e8",mx,my,60,0,Math.PI*2,true,1);
    			break;
    		case "intent":
    			if(level==1 || level==2)
    				addRec("#0c64e8",mx,my,60,60,true,2);
    			break;
    		case "slots":
    			if(level==2 || level==3)
    				addCircle("#fff",mx,my,60,0,Math.PI*2,true,3);
    		case "value":
	    		if(level==3 || level==4)
	    			addRec("#0c64e8",mx,my,60,60,true,4);
    	}
	    dragok = true;
	    draw();
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDragging = false;
    }
    for (var i = 0; i < circles.length; i++) {
        circles[i].isDragging = false;
    }
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }

        for (var i = 0; i < circles.length; i++) {
            var r = circles[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }

        //draw line when rectangle and circle comes near
        //redraw the scene with the new rect positions
        if(level%2==1)
        	joinObjects(circles,rects);	
        else
        	joinObjects(rects,circles);
        draw();
        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}

//adding lines from circle to square when they are sufficienly near to each other else remove them
function joinObjects(objWithMoreEdge,objWithOneEdge) {
	for (var i = 0; i < objWithMoreEdge.length; i++) {
		for (var j = 0; j < objWithOneEdge.length; j++) {
			if(!(objWithOneEdge[j].level==level && objWithMoreEdge[i].level==level+1) && !(objWithOneEdge[j].level==level+1 && objWithMoreEdge[i].level==level)){
				continue;
			}
			var distanceBetObj = distance(objWithMoreEdge[i].x,objWithMoreEdge[i].y,objWithOneEdge[j].x,objWithOneEdge[j].y);
			if(distanceBetObj<distanceThresold && !objWithOneEdge[j].hasLine){
				addLines(objWithMoreEdge[i].x+objWithMoreEdge[i].width/2,objWithMoreEdge[i].y+objWithMoreEdge[i].height/2,objWithOneEdge[j].x+objWithOneEdge[j].width/2,objWithOneEdge[j].y+objWithOneEdge[j].height/2,level);
				objWithMoreEdge[i].lines.push(lines[lines.length-1]);
				objWithOneEdge[j].line = lines[lines.length-1];
				objWithMoreEdge[i].hasLine = true;
				objWithOneEdge[j].hasLine = true;
				console.log(objWithMoreEdge[i].lines.length+" adding edge ");
			}else{
				if(objWithOneEdge[j].hasLine){
					var listOfLinesToRemove = [];
					for (var k = 0; k < objWithMoreEdge[i].lines.length; k++) {
						if(objWithOneEdge[j].line===objWithMoreEdge[i].lines[k] && distanceBetObj<distanceThresold){
							objWithOneEdge[j].line.cx = objWithMoreEdge[i].x+objWithMoreEdge[i].width/2;
							objWithOneEdge[j].line.cy = objWithMoreEdge[i].y+objWithMoreEdge[i].height/2;
							objWithOneEdge[j].line.rx = objWithOneEdge[j].x+objWithOneEdge[j].width/2;
							objWithOneEdge[j].line.ry = objWithOneEdge[j].y+objWithOneEdge[j].height/2;
							break;
						}else{
							if(objWithOneEdge[j].line===objWithMoreEdge[i].lines[k]){
								listOfLinesToRemove.push(objWithMoreEdge[i].lines[k]);
							}
						}
					}
					removeLines(listOfLinesToRemove,objWithMoreEdge[i],objWithOneEdge[j]);
				}
			}
		}
	}
}

//first object has multiple lines (List) and second object has only one lines
function removeLines(listOfLinesToRemove,firstObject,secondObject) {
	for (var k = 0; k < listOfLinesToRemove.length; k++) {
		var index = firstObject.lines.indexOf(listOfLinesToRemove[k]);
		var index2 = lines.indexOf(listOfLinesToRemove[k]);
		if (index > -1) {
		  firstObject.lines.splice(index, 1);
		}
		if (index2 > -1) {
		  lines.splice(index2, 1);
		}
		if(firstObject.lines.length==0){
			firstObject.hasLine = false;
		}
		// secondObject.line = null;
		secondObject.hasLine = false;
	}
}

function openRightView() {
    var width = rightView[0].style.width;
    console.log(width);
    if(width!=='0%'){
    	rightView[0].style.width = '0%';
    }else{
    	rightView[0].style.width = '30%';
    }
}

function distance(cx,cy,rx,ry) {
	return Math.sqrt(Math.pow(cx-rx,2)+Math.pow(cy-ry,2));
}

skillButton.onclick = function() {
    objectTodraw = "skill";
    var current = document.getElementsByClassName("active1");
    current[0].className = current[0].className.replace(" active1", "");
    this.className += " active1";
};

intentButton.onclick = function() {
    objectTodraw = "intent";
    var current = document.getElementsByClassName("active1");
    current[0].className = current[0].className.replace(" active1", "");
    this.className += " active1";
};

slotButton.onclick = function() {
    objectTodraw = "slots";
    var current = document.getElementsByClassName("active1");
    current[0].className = current[0].className.replace(" active1", "");
    this.className += " active1";
};

typeButton.onclick = function() {
    objectTodraw = "value";
    var current = document.getElementsByClassName("active1");
    current[0].className = current[0].className.replace(" active1", "");
    this.className += " active1";
};

fullGraph.onclick = function(){
	showFullGraph = !showFullGraph;
    var current = document.getElementsByClassName("active1");
    current[0].className = current[0].className.replace(" active1", "");
    this.className += " active1";
	draw();
}

function changeLevel(context,newLevel) {
	level = newLevel;
    var current = document.getElementsByClassName("active2");
    current[0].className = current[0].className.replace(" active2", "");
    context.className += " active2";
	draw();
}