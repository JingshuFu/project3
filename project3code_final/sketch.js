// this is a very simple sketch that demonstrates how to place a video cam image into a canvas

let video;
let pose;
let model;
let predictions = [];

let brain;
let poseLabel = "";

let rightY, leftY, mySound1, mySound2;
let num = 20
let mx = new Array(num);
let my = new Array(num);

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let put0 = 0,
	put1 = 0,
	put2 = 0;
let bassCircle;
let spring1, spring2, summer1, summer2, fall1, fall2, fall3, winter1, winter2;
let star, snow;
let leaf;
//speech
var myVoice = new p5.Speech('Google UK English Male', speechLoaded);

myVoice.onStart = speechStarted;
myVoice.onEnd = speechEnded;

var lyric = "Twist the button to feel the changes in the four seasons！";

var speakbutton;
let dropFlag = 0;

function preload() {
	video = createCapture(VIDEO, () => {
		loadHandTrackingModel();
	});
	video.hide();
	mySound1 = loadSound('assets_sounds_bubbles.mp3');
	mySound2 = loadSound('assets_sounds_wipe.mp3');
	leaf = createImg('img/1.gif');
	leaf.hide();
	bigeye = loadImage('img/eye.png');
	spring1 = loadImage('img/1.png');
	spring2 = loadImage('img/2.png');
	summer1 = loadImage('img/3.png');
	summer2 = loadImage('img/4.png');
	fall1 = loadImage('img/5.png');
	fall2 = loadImage('img/6.png');
	fall3 = loadImage('img/7.png');
	winter1 = loadImage('img/8.png');
	winter2 = loadImage('img/9.png');
	star = loadImage('img/star.png');
	snow = loadImage('img/snow.png');
}



function setup() {
	createCanvas(640, 480);
	// video = createCapture(VIDEO);
	// video.hide();
	// poseNet = ml5.poseNet(video, modelLoaded);
	// poseNet.on('pose', gotPoses)

	leaf_width = leaf.width;
	leaf_height = leaf.height;
	print("leaf width: " + leaf_width);
	print("leaf height: " + leaf_height);
	leaf.size(leaf_width / 2, leaf_height / 2)
	leaf.hide();
	serial = new p5.SerialPort();
	serial.list();
	console.log("serial.list()   ", serial.list());
	serial.open("/dev/tty.usbmodem14501");
	serial.on('connected', serverConnected);
	serial.on('list', gotList);
	serial.on('data', gotData);
	serial.on('error', gotError);
	serial.on('open', gotOpen);

	speakbutton = createButton('Feel the season!');
	speakbutton.position(250, 750);
	speakbutton.mousePressed(buttonClicked);
}

// function modelLoaded() {
// 	console.log("modelLoaded function has been called so this work!!!!");
// };


//************************************************************************************************ */
function serverConnected() {
	console.log("Connected to Server");
}

function gotList(thelist) {
	console.log("List of Serial Ports:");

	for (var i = 0; i < thelist.length; i++) {

		console.log(i + " " + thelist[i]);
	}
}

function gotOpen() {
	console.log("Serial Port is Open");
}

function gotError(theerror) {
	console.log(theerror);
}

function gotData() {
	var currentString = serial.readLine(); // read the incoming string
	trim(currentString); // remove any trailing whitespace
	if (!currentString) return; // if the string is empty, do no more
	console.log("currentString  ", currentString); // println the string
	latestData = currentString; // save it for the draw method
	console.log("latestData" + latestData); //check to see if data is coming in
	splitter = split(latestData, ','); //
	put0 = splitter[0];
	put1 = splitter[1];
	put2 = splitter[2];



}

function gotRawData(thedata) {
	println("gotRawData" + thedata);
}
//************************************************************************************************ */
// function gotPoses(poses) {
// 	//console.log(poses);
// 	if (poses.length > 0) {
// 		pose = poses[0].pose;
// 	}
// }

function draw() {
	if (model) {
		image(video, 0, 0);
	}

	//********************************************************************************** */
	if (put1 >= 0) {
		image(spring1, 250, 157, 400, 380);
	}
	if (put1 > 200) {
		image(spring2, 250, 157, 400, 380);
	}
	if (put1 > 300) {
		image(summer1, 250, 157, 400, 380);
	}
	if (put1 > 400) {
		image(summer2, 250, 1575, 400, 380);
	}
	if (put1 > 500) {
		image(fall1, 250, 157, 400, 380);
	}
	if (put1 > 600) {
		image(fall2, 250, 157, 400, 380);
	}
	if (put1 > 700) {
		image(fall3, 250, 157, 400, 380);

	}
	if (put1 > 800) {
		image(winter1, 250, 157, 400, 380);
	}
	if (put1 > 900) {
		image(winter2, 250, 157, 400, 380);
		leaf.position(300, 230, 400, 480);
	}

	if (put2 < 10) {
		fill(0, 0, 0, 80);
		stroke(0, 640, 480);
		rect(0, 0, windowWidth, windowHeight);
		image(star, 0, 0, 320, 240);
		image(star, 320, 0, 320, 240);
		image(star, 320, 300, 320, 240);
		image(star, 0, 300, 320, 240);
	}
	//********************************************************************************** */
	leaf.position(300, 230, 400, 480);
	if (dropFlag > 0) {
		leaf.show();
	} else {
		leaf.hide();
	}

	dropFlag = dropFlag - 1;
	if (predictions.length > 0) {
		console.log(predictions);
		// We can call both functions to draw all keypoints and the skeletons
		drawKeypoints();
		// drawSkeleton();
		let annotations = predictions[0].annotations;
		// translate(annotations.middleFinger[0][0], annotations.middleFinger[0][1], 7);
		// fill(223, 120, 30);
		// ellipse(0, 0, 10, 10);
		if (dist(annotations.middleFinger[0][0], annotations.middleFinger[0][1], 440, 300) < 200) {
			dropFlag = 10;
		}
	}


	// for (let i = num - 1; i > 0; i--) {
	// 	mx[i] = mx[i - 1];
	// 	my[i] = my[i - 1];
	// }

	// if (pose) {
	// 	mx[0] = pose.nose.x
	// 	my[0] = pose.nose.y
	// 	for (let i = 0; i < num; i++) {
	// 		fill(255, 0, 0, 255 - 10 * i);
	// 		//ellipse(pose.nose.x, pose.nose.y, 10);
	// 		//ellipse(mx[i], my[i], (1.2 * num - i) / 2);
	// 	}
	// 	fill(223, 120, 30);
	// 	//if (pose.rightWrist.x < 480) {
	// 	//mySound1.play()
	// 	//}
	// 	//if (pose.leftWrist.y < 480) {
	// 	//mySound2.play()
	// 	//}
	// 	ellipse(pose.rightWrist.x, pose.rightWrist.y, 30)
	// 	ellipse(pose.leftWrist.x, pose.leftWrist.y, 30)
	// }

}


function mousePressed() {

	console.log(mouseX, mouseY);
}


function drawKeypoints() {
	let prediction = predictions[0];
	for (let j = 0; j < prediction.landmarks.length; j++) {
		let keypoint = prediction.landmarks[j];
		fill(255, 0, 0);
		noStroke();
		ellipse(keypoint[0], keypoint[1], 10, 10);
	}
}

// A function to draw the skeletons
function drawSkeleton() {
	let annotations = predictions[0].annotations;
	stroke(255, 0, 0);
	for (let j = 0; j < annotations.thumb.length - 1; j++) {
		line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
	}
	for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
		line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
	}
	for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
		line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
	}
	for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
		line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
	}
	for (let j = 0; j < annotations.pinky.length - 1; j++) {
		line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
	}

	line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
	line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
	line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
	line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
	line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);

}



async function loadHandTrackingModel() {
	// Load the handpose model.
	model = await handpose.load();
	predictHand();
	let options = {
		inputs: 63,
		outputs: 2,
		task: 'classification',
		debug: true
	}
	// brain = ml5.neuralNetwork(options);
	const modelInfo = {
		model: 'model/model.json',
		metadata: 'model/model_meta.json',
		weights: 'model/model.weights.bin',
	};
	// brain.load(modelInfo, brainLoaded);
	let modelJson = await fetch(modelInfo.model);
	modelJson = await modelJson.text();
	const modelJsonFile = new File([modelJson], 'model.json', {
		type: 'application/json'
	});

	let weightsBlob = await fetch(modelInfo.weights);
	weightsBlob = await weightsBlob.blob();
	const weightsBlobFile = new File([weightsBlob], 'model.weights.bin', {
		type: 'application/macbinary',
	});

	brain = await tf.loadLayersModel(tf.io.browserFiles([modelJsonFile, weightsBlobFile]));
	// console.log('brain', brain)
	brainLoaded();
}

async function predictHand() {
	predictions = await model.estimateHands(video.elt);
	setTimeout(() => predictHand(), 100);
}


function brainLoaded() {
	console.log('Hand pose classification ready!');
	classifyPose();
}

async function classifyPose() {
	if (predictions.length > 0) {
		const landmarks = predictions[0].landmarks;
		let inputs = [];
		for (let i = 0; i < landmarks.length; i++) {
			inputs.push(landmarks[i][0] / 640);
			inputs.push(landmarks[i][1] / 480);
			inputs.push((landmarks[i][2] + 80) / 80);
		}
		// brain.classify(inputs, gotResult);
		const output = tf.tidy(() => {
			return brain.predict(tf.tensor(inputs, [1, 63]));
		});
		const result = await output.array();
		gotResult(result);
	} else {
		setTimeout(classifyPose, 100);
	}
}

function gotResult(results) {
	if (results[0] && results[0][0]) {
		if (results[0][0] > 0.5) poseLabel = 'idle';
		if (results[0][1] > 0.5) poseLabel = 'magic'
		if (results[0][2] > 0.5) poseLabel = 'close';
	}
	//console.log(results[0].confidence);
	classifyPose();
}

function modelLoaded() {
	console.log('Hand pose model ready');
}


function buttonClicked() {
	if (speakbutton.elt.innerHTML == 'Feel the season！') myVoice.speak(lyric);
	else if (speakbutton.elt.innerHTML == 'I got it!') myVoice.stop();
}

function speechLoaded() {
	myVoice.speak("testing one two three!!!");
}

function speechStarted() {
	speakbutton.elt.innerHTML = 'I got it!';
}

function speechEnded() {
	speakbutton.elt.innerHTML = 'Feel the season!';
}
