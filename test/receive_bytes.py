"""
Server receiver of the file
"""
import receive_data

# device's IP address
# HOST = "127.0.0.1"
HOST = "0.0.0.0"
PORT = 5001

# received_chunks = receive_data.receive_chunks(HOST, PORT)
receive_data.play_audio_stream(HOST, PORT)

# print(len(received_chunks))

# # for chunk in received_chunks:
# #   print(chunk.decode(), end = '')



# import pyaudio
# import wave
# import sys

# CHUNK = 32
# WIDTH = 2
# CHANNELS = 2
# RATE = 44100

# p = pyaudio.PyAudio()
# stream = p.open(format=p.get_format_from_width(WIDTH),
#                 channels=CHANNELS,
#                 rate=RATE,
#                 output=True)

# # Play received data
# for chunk in received_chunks:
#     stream.write(chunk)

# stream.stop_stream()
# stream.close()

# p.terminate()s