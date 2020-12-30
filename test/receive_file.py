"""
Server receiver of the file
"""
import receive_data
import os

# device's IP address
# HOST = "127.0.0.1"
HOST = "0.0.0.0"
PORT = 5001

received_file = receive_data.receive_file(HOST, PORT)

os.system(f'python play_audio_file.py {received_file}')