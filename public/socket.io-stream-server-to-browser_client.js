/////////////////////////////
// JavaScript for Browser
/////////////////////////////

$(document).ready(function () {

  $(function () {
    var socket = io();

    socket.on("connect", function () {
      console.log("on connect");

      ss(socket).on('file', function (stream, data) {
        console.log('received', data);

        var binaryString = "";

        stream.on('data', function (data) {
          console.log('data')

          for (var i = 0; i < data.length; i++) {
            binaryString += String.fromCharCode(data[i]);
          }

        });

        stream.on('end', function (data) {
          console.log('end')
          $("#img").attr("src", "data:image/png;base64," + window.btoa(binaryString));

          binaryString = "";
        });
      });
    });
  });
});
