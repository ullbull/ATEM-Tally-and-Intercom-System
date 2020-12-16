import socketio

sio = socketio.Client()

@sio.event
def connect():
  print("I'm connected!")
  # sio.emit('msg', 'hej!')

@sio.event
def disconnect():
  print("I'm disconnected!")

@sio.on('msg')
def msg(data):
  print('received msg:', data)

sio.connect('http://localhost:5000')
sio.wait()
