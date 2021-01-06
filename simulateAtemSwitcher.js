const atemManager = require('./atemManager.js');

function init(io) {
   io.on('connection', function (socket) {
      // Send to client
      socket.emit('ATEM', atemManager.getProgPrev());

      socket.on('ATEM', ({ program, preview }) => {
         console.log('ATEM program:', program);
         console.log('ATEM preview:', preview);
         atemManager.setProgram(program);
         atemManager.setPreview(preview);

         // Send to all clients
         io.emit('ATEM', { program, preview });
      })

      socket.on('ATEM get status', () => {
         socket.emit('ATEM', atemManager.getProgPrev());
      })

   });
}

module.exports = {
   init
}