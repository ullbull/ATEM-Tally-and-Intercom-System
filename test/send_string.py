import socket

port = 5001
host = '192.168.1.66'
host = '127.0.0.1'

message = 'Hej där! Hur står det till idag? Bla bal balbalbalbalblalblablalblabl'

# create t  he client socket
s = socket.socket()
print(f"[+] Connecting to {host}:{port}")
s.connect((host, port))
print("[+] Connected.")

s.send(message.encode())
# time.sleep(1)
s.close()