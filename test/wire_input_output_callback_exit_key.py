"""
PyAudio Example: Make a wire between input and output (i.e., record a
few samples and play them back immediately).

This is the callback (non-blocking) version.
"""

import pyaudio
import time
import threading
import sys
import fileinput
import readchar
from pynput import keyboard

def callback(in_data, frame_count, time_info, status):
  return (in_data, pyaudio.paContinue)

def listen_to_stream(stream):
  global run
  print('listening...')
  stream.start_stream()
  
  while stream.is_active():
      time.sleep(0.1)
      if run == False:
        break

  stream.stop_stream()
  stream.close()

def on_press(key):
  global run
  try:
    print(f'alphanumeric key {key.char} pressed')
  except AttributeError:
    print(f'special key {key} pressed')

def on_release(key):
  global run
  char = ''
  try:
    char = key.char
  except AttributeError:
    char = ''
    
  print(f'{key} released')
  if key == keyboard.Key.esc or char == EXIT_CHAR:
    run = False
    # Stop listener
    return False

WIDTH = 2
CHANNELS = 2
RATE = 44100
EXIT_CHAR = 'q'

if __name__ == "__main__":

  p = pyaudio.PyAudio()

  # Open the audio stream
  stream = p.open(format=p.get_format_from_width(WIDTH),
                  channels=CHANNELS,
                  rate=RATE,
                  input=True,
                  output=True,
                  stream_callback=callback)

  run = True

  # Creating threads
  t_listen_to_stream = threading.Thread(
    target=listen_to_stream,
    args=(stream,),
    daemon=True
    )
  t_listen_to_keyboard = keyboard.Listener(
      on_press=on_press,
      on_release=on_release)

  # Starting threads
  t_listen_to_stream.start()
  t_listen_to_keyboard.start()
  
  print(f'Pres {EXIT_CHAR} to exit.')

  # Waiting for threads to finnish
  t_listen_to_stream.join()
  t_listen_to_keyboard.join()

  # All threads finished

  p.terminate()
