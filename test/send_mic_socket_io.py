import socketio
import pyaudio
import time
import sys
from pynput import keyboard

def stream_audio():
  if not stream.is_active():
    stream.start_stream()

def stop_stream_audio():
  stream.stop_stream()

def on_press(key):
  try:
    # Char key is pressed
    if (key.char == 'a'):
      print('a')

  except AttributeError:
    # Special key is pressed
    if (key == keyboard.Key.shift):   
      stream_audio()

    if (key == keyboard.Key.ctrl_r):
      print('right ctrl')
    
    if (key == keyboard.Key.esc):
      print('esc')
      key_listener.stop()
   
def on_release(key):
  print('key up:', key)
  try:
    # Char key is released      
    if(key.char == 'q'):
      key_listener.stop()

  except AttributeError:
    # Special key is released
    if (key == keyboard.Key.shift):
      stop_stream_audio()


WIDTH = 2
CHANNELS = 2
RATE = 44100

if sys.platform == 'darwin':
    CHANNELS = 1

p = pyaudio.PyAudio()

def callback(in_data, frame_count, time_info, status):
    sio.emit('stream', in_data)
    return (in_data, pyaudio.paContinue)

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                start=False,
                stream_callback=callback)

# Create the socket
sio = socketio.Client()

@sio.on('message')
def on_message(data):
  print('received a message!', data)

@sio.event
def connect():
    print("I'm connected!")
   
@sio.event
def connect_error():
  print("The connection failed!")

@sio.event
def disconnect():
  print("I'm disconnected!")
  stream.stop_stream()
  sio.disconnect()

# port = 5000
# host = '111.111.1.54'
# host = '127.0.0.1'

# Connect to server
sio.connect('http://localhost:5000')

# Create keyboard listener thread
key_listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)

key_listener.start()

print('Hold shift key to speak.')
print('Press esc to exit.')

# Wait for key listener to stop
key_listener.join()

print('Shutting down...')

sio.disconnect()
stream.stop_stream()
stream.close()
p.terminate()

  

