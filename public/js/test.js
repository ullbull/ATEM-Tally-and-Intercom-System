 //1)   
 const startRecording = document.getElementById('start-recording');
 const stopRecording = document.getElementById('stop-recording');
 let recordAudio;

 //2)
 const socketio = io();
 const socket = socketio.on('connect', function() {
     startRecording.disabled = false;
 });

 //3)
 startRecording.onclick = function() {
     startRecording.disabled = true;

     //4)
     navigator.getUserMedia({
         audio: true
     }, function(stream) {

             //5)
             recordAudio = RecordRTC(stream, {
                 type: 'audio',

             //6)
                 mimeType: 'audio/webm',
                 sampleRate: 44100,
                 // used by StereoAudioRecorder
                 // the range 22050 to 96000.
                 // let us force 16khz recording:
                 desiredSampRate: 16000,
              
                 // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
                 // CanvasRecorder, GifRecorder, WhammyRecorder
                 recorderType: StereoAudioRecorder,
                 // Dialogflow / STT requires mono audio
                 numberOfAudioChannels: 1
         });

         recordAudio.startRecording();
         stopRecording.disabled = false;
     }, function(error) {
         console.error(JSON.stringify(error));
     });
 };

 // 1)
 stopRecording.onclick = function() {
    // recording stopped
    startRecording.disabled = false;
    stopRecording.disabled = true;

    // stop audio recorder
    recordAudio.stopRecording(function() {
        // after stopping the audio, get the audio data
        recordAudio.getDataURL(function(audioDataURL) {

            //2)
            var files = {
                audio: {
                    type: recordAudio.getBlob().type || 'audio/wav',
                    dataURL: audioDataURL
                }
            };
            // submit the audio file to the server
            socketio.emit('message', files);
        });
    });
};

// 3)
// when the server found results send
// it back to the client
const resultpreview = document.getElementById('results');
socketio.on('results', function (data) {
    console.log(data);
    // show the results on the screen
    if(data[0].queryResult){
        resultpreview.innerHTML += "" + data[0].queryResult.fulfillmentText;
    }
});