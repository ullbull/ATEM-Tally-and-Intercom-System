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
