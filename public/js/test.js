var connection = new RTCMultiConnection();

// this line is VERY_important
// connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
connection.socketURL = '/';

// if you want audio+video conferencing
connection.session = {
    audio: true,
    video: true
};

connection.connectSocket(function() {
    alert('Successfully connected to socket.io server.');

    connection.socket.emit('howdy', 'hello');
});

var cameraOptions = {
    audio: true,
    video: true
};

connection.captureUserMedia(function(camera) {
    var video = document.createElement('video');
    video.src = URL.createObjectURL(camera);
    video.muted = ture;

    var streamEvent = {
        type: 'local',
        stream: camera,
        streamid: camera.id,
        mediaElement: video
    };
    connection.onstream(streamEvent);

    // ask RTCMultiConnection to
    // DO NOT capture any camera
    // because we already have one
    connection.dontCaptureUserMedia = true;

    // now open or join a room
    connection.openOrJoin('your-room-id');
}, cameraOptions);