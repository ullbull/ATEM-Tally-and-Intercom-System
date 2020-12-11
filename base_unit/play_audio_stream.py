"""
Server receiver of the file
"""
# import receive_data


import socket
import tqdm
import os
import time
import sys
import pyaudio
import wave
import sys
import readchar
import threading
from pynput import keyboard
from time_millis import millis

def exit_on_user_input(exit_char):
    global run
    global data
    print(f'Press {exit_char} to exit.')
    while run:
        c = readchar.readkey()   
        if c == exit_char:
            print('yey')
            run = False

        if c == 's':
            print('data:', data)
        time.sleep(5)


def on_press(key):
  global run
  global button_down
  global button_up
  
  button_up = None

  try:
    button_down = key.char
  except AttributeError:
    # Special key is pressed
    button_down = ''
  



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
  


class MyKeyboard():
  key = None
  state = 'up'

def action():
  global button_down
  global button_up
  global keybrd
  global last_keybrd
  global stream
  global run

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

    if keybrd.key == 'e' and keybrd.state == 'down':
      run = False

  if keybrd.key != last_keybrd.key:
    last_keybrd.key = keybrd.key
    # Keyboard has changed key


exit_char = 'e'
run = True
data = 'nothing yet'
button_down = ''
button_up = ''
keybrd = MyKeyboard()
last_keybrd = MyKeyboard()



# device's IP address
# HOST = "127.0.0.1"
host = "0.0.0.0"
port = 5001

# received_chunks = receive_data.receive_chunks(HOST, PORT)
# receive_data.play_audio_stream_2(HOST, PORT)

CHUNK_SIZE = 64
WIDTH = 2
CHANNELS = 2
RATE = 44100

p = pyaudio.PyAudio()



# create the server socket
# TCP socket
s = socket.socket()

# bind the socket to our local address
s.bind((host, port))

# enabling our server to accept connections
# 5 here is the number of unaccepted connections that
# the system will allow before refusing new connections
s.listen(5)

print(f"[*] Listening as {host}:{port}")

# accept connection if there is any
client_socket, address = s.accept() 

# if below code is executed, that means the sender is connected
print(f"[+] {address} is connected.")


p = pyaudio.PyAudio()

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                output=True)

stream.start_stream()

def read_chunk(socket, chunk_size):
  return socket.recv(chunk_size)

def play_chunk(stream, data):
  stream.write(data)

def read_and_play(stream, socket, chunk_size):
  global run
  while run:
    play_chunk(stream, read_chunk(socket, chunk_size))

print('Press e to exit.')

# Create threads
t_play_stream = threading.Thread(
  target=read_and_play,
  args=(stream, client_socket, CHUNK_SIZE,),
  daemon=True
  )
t_listen_to_keyboard = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)
  
# Start threads
t_listen_to_keyboard.start()
t_play_stream.start()

empty = sys.getsizeof(client_socket.recv(0))
size = empty + 1
while run:
    action()
    time.sleep(0.1)

print('4')

# # Wait for threads to finnish
# t_listen_to_keyboard.join()

stream.stop_stream()
stream.close()

# close the client socket
client_socket.close()

# close the server socket
s.close()

p.terminate()