"""
Client that sends the file (uploads)
"""
import socket
import time

SEPARATOR = "<SEPARATOR>"
BUFFER_SIZE = 1024 * 4

def send_text(text, host, port):
  # create the client socket
  s = socket.socket()
  print(f"[+] Connecting to {host}:{port}")
  s.connect((host, port))
  print("[+] Connected.")

  s.send(text.encode())
  time.sleep(1)
  s.close()


filename = 'test.txt'
port = 5001
host = '192.168.1.66'

try:
  message = 'Hej där!'
  print(f'Sending string "{message}"')
  send_text(message, host, port)
  print('Done')
except Exception as e:
  print(e)

