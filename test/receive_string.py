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

# receive using client socket, not server socket
received_bytes = []
empty = sys.getsizeof(client_socket.recv(0))
size = empty + 1
while size > empty:
    bytes_read = client_socket.recv(chunk_size)
    size = sys.getsizeof(bytes_read)
    received_bytes.append(bytes_read)

# # Print received data
print('received: ')
for bytes_read in received_bytes:
    print(bytes_read.decode(), end = '')

# close the client socket
client_socket.close()

# close the server socket
s.close()
