const events = require('events');
const util = require('util');

const ConnectionState = {
   closed: { description: 'Not connected' },
   attempting: { description: 'Attempting to connect' },
   establishing: { description: 'Establishing connection' },
   open: { description: 'connected' }
};

function Device() {
   this.program = 0;
   this.preview = 0;

   this.switchProgramPreview = function () {
      let temp = this.preview;
      this.preview = this.program;
      this.program = temp;
   }

   const atem = this;
   atem.state = ConnectionState.closed;

   /** Call the constructor of EventEmitter */
   events.EventEmitter.call(this);

   this.connect = function () {
      atem.state = ConnectionState.attempting;
      // atem.emit('connectionStateChange', state);

      setTimeout(() => {
         atem.state = ConnectionState.open;
      }, 3000);
      // atem.emit('connectionStateChange', state);
   }

   this.disconnect = function (callback) {
      console.log('Disconnecting');
      atem.state = ConnectionState.closed;
      if (callback) callback();
   }


   /**
    * Performs a cut transition between preview and program
    * @function Device#cut
    */
   this.cut = function () {
      // Switch program and preview
      let temp = atem.preview;
      atem.preview = atem.program;
      atem.program = temp;

      atem.emit('programBus', atem.program);
      atem.emit('previewBus', atem.preview);
   };

   /**
    * Sets the desired source in program. (cut transition)
    * @function Device#setProgram
    * @param {SourceID} sourceID the ID of the source
    */
   this.setProgram = function (sourceID) {
      atem.program = sourceID;
      atem.emit('programBus', atem.program);
   };

   /**
    * Sets the desired source in preview
    * @function Device#setPreview
    * @param {SourceID} sourceID the ID of the source
    */
   this.setPreview = function (sourceID) {
      atem.preview = sourceID;
      atem.emit('previewBus', atem.preview);
   };

   /**
    * The current state of the connection.
    * For more information about the possible values see {@link ConnectionState}
    *
    * @name Device#state
    * @type {ConnectionState}
    */
   Object.defineProperty(this, 'state', {
      get: function () { return state },
      set: function (newValue) {
         state = newValue;
         /**
          * @event Device#connectionStateChange
          * @property {ConnectionState} state The new state
          */
         atem.emit('connectionStateChange', state);
         if (state == 2) { atem.emit('connected'); }
      }
   });
}

// Let Device inherit from the EventEmitter
util.inherits(Device, events.EventEmitter);

Device.ConnectionState = ConnectionState;

module.exports = Device
