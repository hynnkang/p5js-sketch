let canvas;
let database;

let drawing = [];
let currentPath = [];
let isDrawing = false;

function setup() {
	canvas = createCanvas(400, 400);
	canvas.mousePressed(startPath);
	canvas.mouseReleased(endPath);
	canvas.parent('canvasContainer')
	
	const saveButton = select('#saveButton');
	saveButton.mousePressed(saveDrawing);

	const clearButton = select('#clearButton');
	clearButton.mousePressed(clearDrawing);

	var config = {
		apiKey: "AIzaSyAh8hrdoxj5hwWjUbic6HpM3FJ_KuaLzro",
		authDomain: "picture-diary-9002c.firebaseapp.com",
		databaseURL: "https://picture-diary-9002c.firebaseio.com",
		projectId: "picture-diary-9002c",
		storageBucket: "picture-diary-9002c.appspot.com",
		messagingSenderId: "636241340221"
	  };
	firebase.initializeApp(config);
	database = firebase.database();

	
	let params = getURLParams();
	if (params.id) {
		showDrawing(params.id);
	}
	let ref = database.ref('drawings');
	ref.on('value', gotData, errData);
}


function clearDrawing() {
	drawing = [];
}

function gotData(data) {
	//clear the listing to avoid duplication
	let elts = selectAll('.listing');
	for (let i = 0; i < elts.length; i++) {
		elts[i].remove();
	}

	let drawings = data.val();
	let keys = Object.keys(drawings);
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		//console.log(key);
		let li = createElement('li', '');
		li.class('listing');
		let ahref = createA('#', key);
		ahref.mousePressed(showDrawing);
		ahref.parent(li);

		let perma = createA('?id=' + key, 'permalink');
		perma.parent(li);
		perma.style('padding', '4px');
		li.parent('#drawingList');
	}
}

function showDrawing(key) {
	//console.log(arguments);
	if (key instanceof MouseEvent) {
		key = this.html();
	}

	let ref = database.ref('drawings/' + key);
	ref.once('value', oneDrawing, errData);

	function oneDrawing(data) {
		let dbdrawing = data.val();
		//console.log(dbdrawing);
		drawing = dbdrawing.drawing;
	}
}

function errData(err) {
	console.log(err);
}

function saveDrawing() {
	let ref = database.ref('drawings');
	let data = {
		name: 'Sarah',
		drawing: drawing
	}
	let result = ref.push(data, dataSent);
	console.log(result.key);

	function dataSent(err, status) {
		console.log(status)
	}
}

function startPath() {
	isDrawing = true;
	currentPath = [];
	drawing.push(currentPath);
	console.log(drawing);
}

function endPath() {
	isDrawing = false;
}

function draw() {
	background(0);
	if (isDrawing) {
		let point = {
			x: mouseX,
			y: mouseY
		}
		currentPath.push(point);
	}

	stroke(255);
	strokeWeight(4);
	noFill();
	for (let i = 0; i < drawing.length; i++) {
		let path = drawing[i];
		beginShape();
		for (let j = 0; j < path.length; j++) {
			vertex(path[j].x, path[j].y)
		}
		endShape();
	}
}