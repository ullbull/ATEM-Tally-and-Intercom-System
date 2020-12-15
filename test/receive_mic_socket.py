import socket
import sys

# device's IP address
# host = "127.0.0.1"
host = "0.0.0.0"
port = 5001

chunk_size = 4096

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

import pyaudio
import wave
import time
import sys

WIDTH = 2
CHANNELS = 2
RATE = 44100

# instantiate PyAudio (1)
p = pyaudio.PyAudio()

# define callback (2)
def callback(in_data, frame_count, time_info, status):
    global chunk_size

    # Receive data that will be added to the stream
    data = client_socket.recv(chunk_size)

    return (data, pyaudio.paContinue)

# open stream using callback (3)
stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                output=True,
                stream_callback=callback)

# start the stream (4)
stream.start_stream()

# wait for stream to finish (5)
while stream.is_active():
    time.sleep(0.1)

# stop stream (6)
stream.stop_stream()
stream.close()

# close PyAudio (7)
p.terminate()

# close the client socket
client_socket.close()

# close the server socket
s.close()
