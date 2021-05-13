//***** For getting the personal data*****
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var testBtn = document.getElementById('talk');
const video = document.getElementById('video');
const textReplyButton = document.getElementById('text');
const textReplyButton2 = document.getElementById('text2');
const audioReplyButton = document.getElementById('audio');
const submitButton = document.getElementById('submit');
const acceptButton = document.getElementById('accept');
const continueButton = document.getElementById('continueButton');
const termsLink = document.getElementById('link');
const form = document.getElementById('form');
var messages = document.getElementById('messages');
var messagewrite = document.getElementById('messagewrite');
var dataLabel = document.getElementById('dataLabel');
var dataInputpid = document.getElementById('dataInputpid');
var dataInputName = document.getElementById('dataInputName');
var dataInputApp = document.getElementById('dataInputApp');
var dataInputOcc = document.getElementById('dataInputOcc');
var dataInputHand = document.getElementById('dataInputHand');
var dataInputGender = document.getElementById('dataInputGender');
var dataInputPhone = document.getElementById('dataInputPhone');

var speechResult;
var isText = false;
var isAudio = false;
var ended = false;
var videoLabel = "aceptar";
var check = {
    pidNumber: false,
    nameAndLastName: false,
    application: false,
    occupation: false,
    phone: false,
    dominantHand: false,
    gender: false
};
const data = {
    pidNumber: undefined,
    nameAndLastName: undefined,
    application: undefined,
    occupation: undefined,
    phone: undefined,
    dominantHand: undefined,
    gender: undefined,
    timeStamp: undefined
};

function LabelsInputsOn() {
    if (data.pidNumber == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "N° de documento";
        dataInputpid.style.display = "block";

    }
    else if (data.nameAndLastName == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Nombre(s) y apellido(s)";
        dataInputName.style.display = "block";

    }
    else if (data.application == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Aplicas a ";
        dataInputApp.style.display = "block";

    }
    else if (data.occupation == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Ocupación";
        dataInputOcc.style.display = "block";

    }
    else if (data.phone == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Teléfono";
        dataInputPhone.style.display = "block";
    }
    else if (data.dominantHand == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Mano dominante";
        dataInputHand.style.display = "block";

    }
    else if (data.gender == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Género";
        dataInputGender.style.display = "block";

    }

}

function LabelsAudioOn() {
    if (data.pidNumber == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "N° de documento";
    }
    else if (data.nameAndLastName == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Nombre(s) y apellido(s)";

    }
    else if (data.application == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Aplicas a ";

    }
    else if (data.occupation == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Ocupación";

    }
    else if (data.phone == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Teléfono";

    }
    else if (data.dominantHand == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Mano dominante";

    }
    else if (data.gender == undefined) {
        dataLabel.style.display = "block";
        dataLabel.innerText = "Género";

    }

}

function setDataFromVoice() {
    if (data.pidNumber == undefined) {
        data.pidNumber = speechResult.match(/\d+/g).join("");
        check.pidNumber = true;
    }
    else if (data.nameAndLastName == undefined) {
        data.nameAndLastName = speechResult;
        check.nameAndLastName = true;

    }
    else if (data.application == undefined) {
        data.application = speechResult;
        check.application = true;

    }
    else if (data.occupation == undefined) {
        data.occupation = speechResult;
        check.occupation = true;

    }
    else if (data.phone == undefined) {
        data.phone = speechResult.match(/\d+/g).join("");
        check.phone = true;
    }
    else if (data.dominantHand == undefined) {
        data.dominantHand = speechResult;
        check.dominantHand = true;

    }
    else if (data.gender == undefined) {
        data.gender = speechResult;
        check.gender = true;

    }
}

function setDataFromText() {
    if (data.pidNumber == undefined) {
        data.pidNumber = dataInputpid.value.match(/\d+/g).join("");
        dataInputpid.style.display = "none";
        check.pidNumber = true;

    }
    else if (data.nameAndLastName == undefined) {
        data.nameAndLastName = dataInputName.value;
        dataInputName.style.display = "none";
        check.nameAndLastName = true;
    }
    else if (data.application == undefined) {
        data.application = dataInputApp.value;
        dataInputApp.style.display = "none";
        check.application = true;
    }
    else if (data.occupation == undefined) {
        data.occupation = dataInputOcc.value;
        dataInputOcc.style.display = "none";
        check.occupation = true;
    }
    else if (data.phone == undefined) {
        data.phone = dataInputPhone.value;
        dataInputPhone.style.display = "none";
        check.phone = true;
    }
    else if (data.dominantHand == undefined) {
        data.dominantHand = dataInputHand.value;
        dataInputHand.style.display = "none";
        check.dominantHand = true;
    }
    else if (data.gender == undefined) {
        data.gender = dataInputGender.value;
        dataInputGender.style.display = "none";
        check.gender = true;
    }
}

function nextVideo() {
    if (data.pidNumber == undefined) {
        video.src = "/media/documento.mp4";
    }
    else if (data.nameAndLastName == undefined) {
        video.src = "/media/nombre.mp4";
    }
    else if (data.application == undefined) {
        video.src = "/media/aplica.mp4";
    }
    else if (data.occupation == undefined) {
        video.src = "/media/ocupacion.mp4";
    }
    
    if (ended){
        video.src = "/media/foto.mp4"
    }
}

saveData = async (event) => {
    event.preventDefault();

    if (isText) {
        setDataFromText();
        isText = false;
    }

    if (isAudio) {
        setDataFromVoice();
        isAudio = false;
    }

    if (check.pidNumber * check.nameAndLastName * check.occupation * check.application * check.phone * check.dominantHand * check.gender) {
        ended = true;
        //console.log(data)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch('/data', options);      
    }

    LabelsInputsOn();
    setToReply();
    nextVideo();

}

function inputsOff() {
    dataInputpid.style.display = "none";
    dataInputName.style.display = "none";
    dataInputApp.style.display = "none";
    dataInputOcc.style.display = "none";
    dataInputHand.style.display = "none";
    dataInputGender.style.display = "none";
    dataInputPhone.style.display = "none";
}

function setToReply() {

    if (!ended) {
        form.style.display = "block";
        submitButton.style.display = "none";
        testBtn.style.display = "none";
        textReplyButton2.style.display = "none";
        messagewrite.style.display = "none";
        inputsOff();
        textReplyButton.style.display = "inline";
        audioReplyButton.style.display = "inline";
        messages.innerText = "Elige cómo responder: escribiendo o hablando";

    }
    else {
        submitButton.style.display = "none";
        dataLabel.style.display = "none";
        testBtn.style.display = "none";

    }
}

function testSpeech() {
    textReplyButton2.style.display = "none";
    messagewrite.style.display = "none";
    messages.style.display = "none";
    testBtn.disabled = true;

    var recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
        speechResult = event.results[0][0].transcript;
        messages.innerText = 'Respuesta recibida: ' + speechResult;
        //console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function () {
        recognition.stop();
        testBtn.disabled = false;
        messages.style.display = "block";
        if (speechResult != undefined) {
            submitButton.disabled = false;
            textReplyButton2.style.display = "inline";
            messagewrite.style.display = "block";
            messagewrite.innerText = "Si la respuesta recibida no coincide, prueba escribiendo";

        } else {
            messages.innerText = "No dijiste nada"
            textReplyButton2.style.display = "inline";
            messagewrite.style.display = "block";
            messagewrite.innerText = "Si la respuesta recibida no coincide, prueba escribiendo";
        }
    }

    recognition.onerror = function (event) {
        testBtn.disabled = false;
        messages.innerText = 'Error en el reconocimiento: ' + event.error;
        textReplyButton2.style.display = "inline";
        messagewrite.style.display = "block";
        messagewrite.innerText = "Si la respuesta recibida no coincide, prueba escribiendo";
    }

}

video.addEventListener('ended', () => {

    if (videoLabel === 'aceptar') {
        acceptButton.style.display = "inline";

    } else if (videoLabel === 'politica') {
        termsLink.style.display = "block";
        continueButton.style.display = "inline"
    } else {
        acceptButton.style.display = "none";
        termsLink.style.display = "none";
        setToReply();
    }

    if (ended) {
        window.location.assign('photoCapture.html');
    }
});

video.addEventListener('playing', () => {
    form.style.display = "none";
    messages.innerText = "Párale bolas al video";
    messagewrite.style.display = "none";
    textReplyButton2.style.display = "none";

});

textReplyButton.addEventListener('click', () => {
    isText = true;
    isAudio = false;
    submitButton.disabled = true;
    LabelsInputsOn();
    textReplyButton.style.display = "none";
    audioReplyButton.style.display = "none";
    submitButton.style.display = "inline";
    messages.innerText = "Escribiendo...";

});

textReplyButton2.addEventListener('click', () => {
    isText = true;
    isAudio = false;
    submitButton.disabled = true;
    LabelsInputsOn();
    textReplyButton.style.display = "none";
    audioReplyButton.style.display = "none";
    textReplyButton2.style.display = "none";
    messagewrite.style.display = "none";
    testBtn.style.display = "none";
    submitButton.style.display = "inline";
    messages.innerText = "Escribiendo...";

});


audioReplyButton.addEventListener('click', () => {
    isAudio = true;
    submitButton.disabled = true;
    LabelsAudioOn();
    textReplyButton.style.display = "none";
    audioReplyButton.style.display = "none";
    submitButton.style.display = "inline";
    testBtn.style.display = "inline";
    messages.innerText = "Presiona grabar y habla claramente";
});

testBtn.addEventListener('click', () => {
    testSpeech();

});

continueButton.addEventListener('click', () => {
    nextVideo();
    video.play();
    videoLabel = "datos";
    messages.style.display = "inline";
    continueButton.style.display = "none";
    termsLink.style.display = "none";
});

acceptButton.addEventListener('click', () => {
    acceptButton.style.display = "none";
    video.src = "/media/politica.mp4";
    videoLabel = 'politica'

});

function sendoffpid() {
    if (dataInputpid.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}

function sendoffName() {
    if (dataInputName.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}

function sendoffapp() {
    if (dataInputApp.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}

function sendoffocc() {
    if (dataInputOcc.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}

function sendoffHand() {
    if (dataInputHand.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}

function sendoffGender() {
    if (dataInputGender.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}

function sendoffPhone() {
    if (dataInputPhone.value.length > 0) {
        submitButton.disabled = false

    } else {
        submitButton.disabled = true
    }

}
