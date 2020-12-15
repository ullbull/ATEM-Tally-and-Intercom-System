import socketio

sio = socketio.Client()

@sio.on('message')
def on_message(data):
  print('received a message!', data)

@sio.event
def connect():
  print("I'm connected!")
  sio.emit('message', 'hej!')
  sio.emit('stream', b'1')

@sio.event
def connect_error():
  print("The connection failed!")

@sio.event
def disconnect():
  print("I'm disconnected!")




sio.connect('http://localhost:5000')
print('my sid is', sio.sid)
# sio.disconnect()
