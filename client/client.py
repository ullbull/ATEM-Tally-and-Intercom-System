import socketio
import pyaudio
import time
import sys
from pynput import keyboard
import threading

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
  # print('key up:', key)
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
    try:
      sio.emit('stream', in_data)
    except Exception:
      print("Seems like I'm not connected man!")
    return (in_data, pyaudio.paContinue)

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                start=False,
                stream_callback=callback)

# Create the socket
sio = socketio.Client()

@sio.event
def connect():
    print("I'm connected!")
   
@sio.event
def disconnect():
  print("I'm disconnected!")

@sio.on('msg')
def msg(data):
  print('received a msg:', data)

# port = 5000
# host = '111.111.1.54'
# host = '127.0.0.1'

# Connect to server
sio.connect('http://111.111.1.62:5000/')

# Create keyboard listener thread
key_listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)

t_sio = threading.Thread(
  target=sio.wait,
  daemon=True)

key_listener.start()
t_sio.start()

print('Hold shift key to speak.')
print('Press esc to exit.')

# Wait for key listener to stop
key_listener.join()
t_sio.join()

print('Shutting down...')

sio.disconnect()
stream.stop_stream()
stream.close()
p.terminate()

  

