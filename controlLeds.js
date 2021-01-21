const io = require('socket.io-client');

const socket = io('https://localhost:5000/', {rejectUnauthorized: false});

const mySourceID = 5;

socket.on('connect', () => {
   console.log('Socket connected!', socket.id);
});

socket.on('program and preview', ({ program, preview }, sources) => {
   console.log('Receiving program and preview event', { program, preview, sources })

   if (!program || !preview || !sources) {
      console.error("Couldn't get tally from ATEM switcher! Try make a camera switch on ATEM switcher", { program, preview, sources })
      console.log("Press Cut on ATEM switcher to get tally");
      return;
   }

   // Interpret program and preview sources
   program = interpretSource(program, sources);
   preview = interpretSource(preview, sources);

   console.log('Program:', program);
   console.log('Preview:', preview);

   // Show tally status
   const mySource = getMySource(sources);
   if (mySource == program) {
      camOnProgram();
   } else if (mySource == preview) {
      camOnPreview();
   } else {
      camFree();
   }
});

socket.on('disconnect', () => {
   console.log('Socket disconnected!');
});

function interpretSource(sourceID, sources) {
   switch (sourceID) {
      case 1:
         return sources['HDMI 1'];
      case 2:
         return sources['HDMI 2'];
      case 3:
         return sources['HDMI 3'];
      case 4:
         return sources['HDMI 4'];
      case 5:
         return sources['SDI 1'];
      case 6:
         return sources['SDI 2'];
      case 7:
         return sources['SDI 3'];
      case 8:
         return sources['SDI 4'];
      default:
         return sadEmoji;
   }
}

function getMySource(sources) {
   return interpretSource(mySourceID, sources);
}

function camOnProgram() {
   console.log("PROGRAM");
}

function camOnPreview() {
   console.log("PREVIWE");
}

function camFree() {
   console.log("FREE");
}

