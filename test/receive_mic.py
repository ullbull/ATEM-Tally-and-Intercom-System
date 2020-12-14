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




"""PyAudio Example: Play a wave file (callback version)."""

import pyaudio
import wave
import time
import sys

WIDTH = 2
CHANNELS = 2
RATE = 44100

# if len(sys.argv) < 2:
#     print("Plays a wave file.\n\nUsage: %s filename.wav" % sys.argv[0])
#     sys.exit(-1)

# wf = wave.open(sys.argv[1], 'rb')

# instantiate PyAudio (1)
p = pyaudio.PyAudio()

# define callback (2)
def callback(in_data, frame_count, time_info, status):
    global chunk_size
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










# # receive using client socket, not server socket
# received_bytes = []
# empty = sys.getsizeof(client_socket.recv(0))
# size = empty + 1
# while size > empty:
#     bytes_read = client_socket.recv(chunk_size)
#     size = sys.getsizeof(bytes_read)
#     received_bytes.append(bytes_read)

# # # Print received data
# print('received: ')
# i = 0
# for bytes_read in received_bytes:
#     print(f'''byte {i}:
    
# {bytes_read}''')
#     i += 1

# close the client socket
client_socket.close()

# close the server socket
s.close()
