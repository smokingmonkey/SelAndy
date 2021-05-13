var video = document.querySelector('#video');
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
let trackButton = document.getElementById("trackbutton");
let lowBpm = document.getElementById("lowBpm");
let normalBpm = document.getElementById("normalBpm");
let highBpm = document.getElementById("highBpm");
let bpmAudio = document.getElementById("bpmAudio");
let updateNote = document.getElementById("updatenote");
let score = document.getElementById("score");
let timer = document.getElementById("timer");
let rhythm = document.getElementById("rhythm");
const padding = 60;
let px = padding + Math.floor(Math.random()*(canvas.width - 2*padding));
let py = padding + Math.floor(Math.random()*(canvas.height - 2*padding));
let isVideo = false;
let isAudio = false;
let model = null;
let Score;
var seconds;
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
let isSlider = false;
var person;
var id;
let bpm;


let modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.5,    // confidence threshold for predictions.
  }

slider.value = modelParams.scoreThreshold*100;  
output.innerHTML = `Score Threshold: ${modelParams.scoreThreshold}`;
slider.oninput = function() {
    isSlider = true;
    modelParams.scoreThreshold = this.value/100;
    output.innerHTML = `Score Threshold: ${modelParams.scoreThreshold}`;
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Detectando ...";
            runDetection();
        } 
        else {
            updateNote.innerText = "Conecta la cámara";
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        trackButton.innerText = "¡PARA AHÍ!";
        updateNote.innerText = "Iniciando video ...";
        startVideo();
        isVideo = true;
        disableButtons();
        playAudio(isAudio);
        restartScoreAndTimer();
        CountDownTimer();
        
    } 
    else {
        trackButton.innerText = "INICIAR";
        updateNote.innerText = "Parando video ...";
        handTrack.stopVideo(video);
        isVideo = false;
        enableButtons();
        isAudio = false;
        playAudio(isAudio);
        updateNote.innerText = "Video parado";
        restartScoreAndTimer();
                        
    }
}

saveData = () =>{
    
    const data = {
        name: "",
        pid: "",
        gameScore: Score,
        bpm: bpm,
        parameter: modelParams.scoreThreshold
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    
    fetch('/batak', options);
}

trackButton.addEventListener("click", function () {
    toggleVideo();

});

lowBpm.addEventListener("click", function () {
    bpmAudio.src = "/media/80bpm.mp3";
        
    if (!normalBpm.disabled && !highBpm.disabled){
        normalBpm.disabled = true;
        highBpm.disabled = true;
        isAudio = true;
        bpm = "80bpm";
        rhythm.innerText = bpm;
    }
    else{
        normalBpm.disabled = false;
        highBpm.disabled = false;
        isAudio = false;
    } 
});

normalBpm.addEventListener("click", function () {
    bpmAudio.src = "/media/100bpm.mp3";
            
    if (!lowBpm.disabled && !highBpm.disabled){
        lowBpm.disabled = true;
        highBpm.disabled = true;
        isAudio = true;
        bpm = "100bpm"
        rhythm.innerText = bpm; 
    }
    else{
        lowBpm.disabled = false;
        highBpm.disabled = false;
        isAudio = false;
    }
});

highBpm.addEventListener("click", function () {
    bpmAudio.src = "/media/120bpm.mp3";
        
    if (!lowBpm.disabled && !normalBpm.disabled){
        lowBpm.disabled = true;
        normalBpm.disabled = true;
        isAudio = true;
        bpm = "120bpm"
        rhythm.innerText = bpm;
    }
    else{
        lowBpm.disabled = false;
        normalBpm.disabled = false;
        isAudio = false;
    }
});

function runDetection(){
    
    if (isSlider){
        handTrack.load(modelParams).then( lmodel => {
            model = lmodel;
        });
        isSlider = false;
    }
        
    model.detect(video).then( predictions => {
               
        if (predictions[0]) {
            if (px>predictions[0].bbox[0] && px<predictions[0].bbox[0]+predictions[0].bbox[2] 
                && py>predictions[0].bbox[1] && py<predictions[0].bbox[1]+predictions[0].bbox[3]){
                Score++;
                score.innerText = Score;
                px = padding + Math.floor(Math.random()*(canvas.width - 2*padding));
                py = padding + Math.floor(Math.random()*(canvas.height - 2*padding));

            }
        }
        
        if (predictions[1]) {
            if (px>predictions[1].bbox[0] && px<predictions[1].bbox[0]+predictions[1].bbox[2] 
                && py>predictions[1].bbox[1] && py<predictions[1].bbox[1]+predictions[1].bbox[3]){
                Score++;
                score.innerText = Score;
                px = padding + Math.floor(Math.random()*(canvas.width - 2*padding));
                py = padding + Math.floor(Math.random()*(canvas.height - 2*padding));

            }
        }
        
        if (isVideo) {
            videoIntoCanvas();
            drawDot();
            requestAnimationFrame(runDetection);
        }
    });
}

handTrack.load(modelParams).then( lmodel => {
    model = lmodel;
});

function drawDot(){
    ctx.arc(px, py, 5, 0, 2.0 * Math.PI);
    ctx.lineWidth = "20";
    ctx.strokeStyle = "blue";
    ctx.stroke();
   
}

function videoIntoCanvas(){
    canvas.width = video.width;
    canvas.height = video.height;
    drawHFlipped(ctx, video);
}

function drawHFlipped(ctx, img) {
    ctx.save();
    // Multiply the x value by -1 to flip horizontally
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, -img.width, img.height);
    ctx.restore();
}

function CountDownTimer(){
    seconds--;

    if (seconds < 61){
        timer.innerText = seconds;
    }

    if (seconds > 0 && isVideo){
        setTimeout(CountDownTimer, 1000);
    } 
        
    if (seconds == 0){
        trackButton.innerText = "INICIAR";
        updateNote.innerText = "Parando video ...";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video parado";
        enableButtons();
        isAudio = false;
        playAudio();
        saveData();    
                
    }
    
}

function restartScoreAndTimer(){
    Score = 0;
    seconds = 63;
    score.innerText = Score;
    
}

function playAudio(isAudio){
    if (isAudio){
        bpmAudio.play();
    }
    else{
        bpmAudio.pause()
        bpmAudio.currentTime = 0;
    }
}

function disableButtons(){
    lowBpm.disabled = true;
    normalBpm.disabled = true;
    highBpm.disabled = true;
}

function enableButtons(){
    lowBpm.disabled = false;
    normalBpm.disabled = false;
    highBpm.disabled = false;
}

