console.log('test');

function Test() {

}

const myEmitter = new EventEmitter();

myEmitter.on('testEvent', data => {
   console.log('got testEvent: ', data);
});

myEmitter.emit('testEvent');