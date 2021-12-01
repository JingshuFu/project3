// this is a very simple sketch that demonstrates how to place a video cam image into a canvas 
let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let control0 = 0, control1 = 0, control2 = 0;

var myVoice = new p5.Speech('Google UK English Male', speechLoaded);

myVoice.onStart = speechStarted;
myVoice.onEnd = speechEnded;

var lyric = "Hit the green boxes with your clown nose to trigger a sound, or stand far away and punch the small grey boxes with your fist. If you are using the arduino sensor kit, use the button, the potentiometer and the light sensor for interactions";

var speakbutton;

let video;
let poseNet;
let pose;
let eyelX = 0;
let eyelY = 0;
let eyerX = 0;
let eyerY = 0;
let noseX = 0;
let noseY = 0;
let sound;
let sound2;
let sound3;
let sound4;
let rightWristX
let rightWristY
let leftWristX
let leftWristY
let lightOn;


function setup(){

sound = createAudio('bubble.mp3'); 
sound2 = createAudio('bass.mp3');
sound3 = createAudio('hehe.mp3');
sound4 = createAudio('siren.mp3');
lightOn = loadImage('lighton.jpg');
createCanvas(640, 480);
video = createCapture(VIDEO);
video.hide();
poseNet = ml5.poseNet(video, modelLoaded);
poseNet.on('pose', gotPoses)
    
serial = new p5.SerialPort();
serial.list();
console.log("serial.list()   ", serial.list());
serial.open("COM3"); 
serial.on('connected', serverConnected); 
serial.on('list', gotList);
serial.on('data', gotData);
serial.on('error', gotError);
serial.on('open', gotOpen);
    
speakbutton = createButton('Tell Me How to Use');
speakbutton.position(250, 750);
speakbutton.mousePressed(buttonClicked);
      
    
}



function serverConnected() {
  console.log("Connected to Server");
}

function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}

function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  control0 = splitter[0];                 //put the first sensor's data into a variable
  control1 = splitter[1];
  control2 = splitter[2]; 



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

function modelLoaded(){
    console.log("modelLoaded function has been called so this work!!!!");
};



function gotPoses(poses){
    console.log(poses);
    if( poses.length >0 ){
        
    let nX =  poses[0].pose.keypoints[0].position.x;
    let nY =  poses[0].pose.keypoints[0].position.y;
    let elX = poses[0].pose.keypoints[1].position.x;
    let elY = poses[0].pose.keypoints[1].position.y;
    let erX = poses[0].pose.keypoints[2].position.x;
    let erY = poses[0].pose.keypoints[2].position.y;


    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, elX, 0.5);
    eyelY = lerp(eyelY, elY, 0.5);
    eyerX = lerp(eyerX, erX, 0.5);
    eyerY = lerp(eyerY, erY, 0.5);

        
rightWristX = poses[0].pose.rightWrist.x
rightWristY = poses[0].pose.rightWrist.y
          
leftWristX = poses[0].pose.leftWrist.x
leftWristY = poses[0].pose.leftWrist.y
          
   
} 
    
} 

function draw(){
    
let d = dist(noseX, noseY, eyelX, eyelY);  
    
image(video, 0, 0);
    
    noStroke();
    fill(255,0,0);
    ellipse(noseX, noseY, d);  
    
    stroke(255, control1, 0); 
    noFill();
    ellipse(eyelX, eyelY, d); 
        
    stroke(255, control1, 0);
    strokeWeight(4);   
    noFill();
    ellipse(eyerX, eyerY, d);
    
    fill(0,200,100,70);
    stroke(0,200,100);
    rect(0,0,120,windowHeight);
    
    fill(0,200,100,70);
    stroke(0,200,100);
    rect(520,0,120,windowHeight);
    
    //top left
    fill(100,0,100,70);
    stroke(0,200,100);
    rect(0,0,120,140);
    
    //top right
    fill(100,0,100,70);
    stroke(0,200,100);
    rect(520,0,120,140);
    
    //wrist point
    fill(255,0,0);
    noStroke();
    ellipse(rightWristX,rightWristY, d);
    ellipse(leftWristX,leftWristY, d);
    
    
    if(noseX < 120){
    sound.play()
    fill(170,20,170,70);
    stroke(170,20,170);
    rect(0,0,120,windowHeight);
    
  }
    
    if(noseX > 520){
    sound.play()
    fill(170,20,170,70);
    stroke(170,20,170);
    rect(520,0,120,windowHeight);
     
  }
    if(rightWristY < 140 && rightWristX < 120){
    sound2.play()
    fill(160,230,240,70);
    stroke(160,230,240);
    rect(0,0,120,140);
     
  }
    
    if(leftWristY < 140 && leftWristX > 520){
    sound2.play()
    fill(160,230,240,70);
    stroke(160,230,240);
    rect(520,0,120,140);
     
  }
    
firstSound();
lightOff();


}

function firstSound() {
    
    let d = dist(noseX, noseY, eyelX, eyelY); 
    
    if (control0 == 1) {
        
    sound3.play();
        
    fill(238,130,238,70);
    stroke(238,130,238);
    rect(520,0,120,windowHeight);
        
    fill(238,130,238,70);
    stroke(238,130,238);
    rect(0,0,120,windowHeight);    
        
    noStroke();
    fill(238,130,238);
    ellipse(noseX, noseY, d);
        
    //eyes//
    
    stroke(200, 50, 100); 
    noFill();
    ellipse(eyelX, eyelY, d); 
        
    stroke(200, 50, 100);
    strokeWeight(4);   
    noFill();
    ellipse(eyerX, eyerY, d);
        
    }
  
}

function lightOff() {
    
    if(control2 < 3){
        
    sound4.play();
    fill(0,0,0,200);
    noStroke();
    rect(0,0,windowWidth,windowHeight);
        
    image(lightOn,0,0,400,200);
    
    }
}

function buttonClicked()
	{
		if(speakbutton.elt.innerHTML=='Tell Me How to Use') myVoice.speak(lyric);
		else if(speakbutton.elt.innerHTML=='Stop') myVoice.stop();
	}

	function speechLoaded()
	{

		myVoice.speak("testing one two three!!!");
	}

	function speechStarted()
	{
	
		speakbutton.elt.innerHTML = 'Stop';
	}



	function speechEnded(){
        
        speakbutton.elt.innerHTML = 'Tell Me How to Use';
	}












