import socket

port = 5001
host = '192.168.1.66'
host = '127.0.0.1'

# create the client socket
s = socket.socket()
print(f"[+] Connecting to {host}:{port}")
s.connect((host, port))
print("[+] Connected.")
  
"""
PyAudio Example: Make a wire between input and output (i.e., record a
few samples and play them back immediately).
This is the callback (non-blocking) version.
"""

import pyaudio
import time
import sys

WIDTH = 2
CHANNELS = 2
RATE = 44100

if sys.platform == 'darwin':
    CHANNELS = 1

p = pyaudio.PyAudio()

x = 0
def callback(in_data, frame_count, time_info, status):
    global s
    s.send(in_data)
    return (in_data, pyaudio.paContinue)

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                stream_callback=callback)

stream.start_stream()

while stream.is_active():
    time.sleep(0.1)

stream.stop_stream()
stream.close()

p.terminate()

s.close()
