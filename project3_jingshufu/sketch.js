// this is a very simple sketch that demonstrates how to place a video cam image into a canvas 

let video;
let pose;
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

function preload() {

	mySound1 = loadSound('assets_sounds_bubbles.mp3');
	mySound2 = loadSound('assets_sounds_wipe.mp3');

	leaf = createImg('img/1.gif');




}


function setup() {
	createCanvas(640, 480);
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on('pose', gotPoses)




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

	leaf_width = leaf.width;
	leaf_height = leaf.height;
	print("leaf width: " + leaf_width);
	print("leaf height: " + leaf_height);
	leaf.size(leaf_width / 2, leaf_height / 2)

	serial = new p5.SerialPort();

	serial.list();
	console.log("serial.list()   ", serial.list());

	serial.open("/dev/tty.usbmodem14101");

	serial.on('connected', serverConnected);


	serial.on('list', gotList);

	serial.on('data', gotData);


	serial.on('error', gotError);

	serial.on('open', gotOpen);

	speakbutton = createButton('Feel the season!');
	speakbutton.position(250, 750);
	speakbutton.mousePressed(buttonClicked);

}

function modelLoaded() {
	console.log("modelLoaded function has been called so this work!!!!");
};

function gotPoses(poses) {
	console.log(poses);
	if (poses.length > 0) {
		pose = poses[0].pose;
	}

}

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



function draw() {



	image(video, 0, 0);




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



	for (let i = num - 1; i > 0; i--) {
		mx[i] = mx[i - 1];
		my[i] = my[i - 1];
	}


	if (pose) {
		mx[0] = pose.nose.x
		my[0] = pose.nose.y

		for (let i = 0; i < num; i++) {

			fill(255, 0, 0, 255 - 10 * i);
			//ellipse(pose.nose.x, pose.nose.y, 10);
			//ellipse(mx[i], my[i], (1.2 * num - i) / 2);

		}

		fill(223, 120, 30);
		//if (pose.rightWrist.x < 480) {
		//mySound1.play()
		//}
		//if (pose.leftWrist.y < 480) {
		//mySound2.play()
		//}
		//ellipse(pose.rightWrist.x, pose.rightWrist.y, 30)
		//ellipse(pose.leftWrist.x, pose.leftWrist.y, 30)
	}

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
