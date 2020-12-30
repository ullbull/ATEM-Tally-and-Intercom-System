"""
Client that sends the file (uploads)
"""
import send_data

# filename = 'test.txt'
# filename = 'Alarm10.wav'
filename = 'output.wav'
port = 5001
host = '192.168.1.66'
host = '127.0.0.1'

send_data.send_file_stream(filename, host, port)