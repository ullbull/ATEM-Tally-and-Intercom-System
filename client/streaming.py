import socket
import os
import tqdm
import time
import pyaudio
import threading
from pynput import keyboard


def on_press(key):
  global run
  global send
  global button_down
  global button_up
  
  button_up = None

  try:
    button_down = key.char
  except AttributeError:
    # Special key is pressed
    button_down = ''

  if key == keyboard.Key.shift:
    # Send audio
    send = True


def on_release(key):
  global run
  global send
  global button_down
  global button_up

  button_down = None
  send = False

  try:
    button_up = key.char
  except AttributeError:
    # Special key is released
    button_up = ''
    
  if key == keyboard.Key.esc:
    # Stop streaming
    run = False
    # Stop listener
    return False



def connect(host, port):
  # create the client socket
  s = socket.socket()
  print(f"[+] Connecting to {host}:{port}")
  s.connect((host, port))
  print("[+] Connected.")

  return s

def send_chunk(chunk):
  global s
  global stream
  s.sendall(stream.read(CHUNK_SIZE, exception_on_overflow = False))

class MyKeyboard():
  key = None
  state = 'up'

def action():
  global button_down
  global button_up
  global keybrd
  global last_keybrd
  global stream

  # Update button
  if button_down:
    keybrd.state = 'down'
    keybrd.key = button_down
  elif button_up:
    keybrd.state = 'up'
    keybrd.key = button_up

  if keybrd.state != last_keybrd.state:
    last_keybrd.state = keybrd.state
    # Keyboard has changed state

    if keybrd.key == 's' and keybrd.state == 'down':
      print('s down')
      print(stream)

  if keybrd.key != last_keybrd.key:
    last_keybrd.key = keybrd.key
    # Keyboard has changed key



PORT = 5001
HOST = '192.168.1.66'
HOST = '127.0.0.1'
CHUNK_SIZE = 64
WIDTH = 2
CHANNELS = 2
RATE = 44100
run = True
send = False
button_down = ''
button_up = ''
keybrd = MyKeyboard()
last_keybrd = MyKeyboard()

s = connect(HOST, PORT)

# Create an interface to PortAudio
audio = pyaudio.PyAudio()

# Open a stream object
stream = audio.open(format=audio.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                output=True,
                frames_per_buffer=CHUNK_SIZE)

print('Press shift to speak.')
print('Press esc to exit.')

# Create threads
t_listen_to_keyboard = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)
  
# Start threads
t_listen_to_keyboard.start()

# Main loop
while run:
  action()
  if send:
    if stream.is_stopped():
      stream.start_stream()
    send_chunk(CHUNK_SIZE)
  else:
    stream.stop_stream()

# Wait for threads to finnish
t_listen_to_keyboard.join()

# Exit program
stream.stop_stream()
stream.close()
audio.terminate()
# close the socket
s.close()