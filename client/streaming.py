import socket
import os
import tqdm
import time
import pyaudio
import threading
from pynput import keyboard

def callback(in_data, frame_count, time_info, status):
  return (in_data, pyaudio.paContinue)

def on_press(key):
  global run
  global send
  # try:
  #   print(f'alphanumeric key {key.char} pressed')
  # except AttributeError:
  #   print(f'special key {key} pressed')

  if key == keyboard.Key.shift:
    # Send audio
    send = True


def on_release(key):
  global run
  global send

  send = False
  char = ''
  try:
    char = key.char
  except AttributeError:
    char = ''
    
  # print(f'{key} released')

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

def stream_audio(socket, stream):
  global run
  global send
  while run:
    if send:
      # data = stream.read(CHUNK_SIZE)
      s.sendall(stream.read(CHUNK_SIZE, exception_on_overflow = False))

PORT = 5001
HOST = '192.168.1.66'
HOST = '127.0.0.1'
CHUNK_SIZE = 4
WIDTH = 2
CHANNELS = 2
RATE = 44100
run = True
send = False

s = connect(HOST, PORT)

# Create an interface to PortAudio
p = pyaudio.PyAudio()

# Open a stream object
stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                output=True,
                frames_per_buffer=CHUNK_SIZE)

# Create threads
t_stream_audio = threading.Thread(
  target=stream_audio,
  args=(socket, stream,),
  daemon=True
  )
t_listen_to_keyboard = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)

# Start key listener
t_listen_to_keyboard.start()
# Start streaming
t_stream_audio.start()


# Wait for threads to finnish
t_stream_audio.join()
t_listen_to_keyboard.join()

stream.stop_stream()
stream.close()

p.terminate()

# close the socket
s.close()