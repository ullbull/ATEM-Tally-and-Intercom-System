var robot = require("robotjs");
const io = require('socket.io-client');

const socket = io('https://localhost:5000/', { rejectUnauthorized: false });

const mySourceID = 5;

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c

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

var Gpio = require('onoff').Gpio;
var redLED = new Gpio(17, 'out');
var greenLED = new Gpio(27, 'out');
var pushButton = new Gpio(22, 'in', 'both'); // 'both' button presses, and releases should be handled

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
   if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
   }

   if (value == 1) {
      robot.keyToggle('shift', 'down');
   }
   if (value == 0) {
      robot.keyToggle('shift', 'up');
   }
});

function getMySource(sources) {
   return interpretSource(mySourceID, sources);
}

function camOnProgram() {
   console.log("PROGRAM");
   greenLED.writeSync(0);
   redLED.writeSync(1);
}

function camOnPreview() {
   console.log("PREVIEW");
   greenLED.writeSync(1);
   redLED.writeSync(0);
}

function camFree() {
   console.log("FREE");
   greenLED.writeSync(0);
   redLED.writeSync(0);
}

function unexportOnClose() {
   // Turn off LEDs
   greenLED.writeSync(0);
   redLED.writeSync(0);

   // Unexport GPIO to free resources
   greenLED.unexport();
   redLED.unexport();
   pushButton.unexport();

   socket.close();
};