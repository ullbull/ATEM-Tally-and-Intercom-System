const simulateAtemManager = require('./simulateAtemManager.js');

function init(io) {
   io.on('connection', function (socket) {
      // Send to client
      socket.emit('ATEM', simulateAtemManager.getProgPrev());

      socket.on('ATEM', ({ program, preview }) => {
         console.log('ATEM program:', program);
         console.log('ATEM preview:', preview);
         simulateAtemManager.setProgram(program);
         simulateAtemManager.setPreview(preview);

         // Send to all clients
         io.emit('ATEM', { program, preview });
      })

      socket.on('ATEM get status', () => {
         socket.emit('ATEM', simulateAtemManager.getProgPrev());
      })

   });
}

module.exports = {
   init
}